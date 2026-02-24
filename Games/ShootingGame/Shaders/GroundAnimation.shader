Shader "HDRP/Custom/GroundAnimation"
{
    Properties
    {
        _AlbedoMap("Albedo", 2D) = "white" {}
        _NormalMap("Normal", 2D) = "bump" {}

        // Exposed properties for tweaking, globals provide dynamic offsets
        _WindDisplacementMultiplier("Wind Displacement Multiplier", Range(0, 5)) = 1.0

        [HideInInspector] _EmissionColor("Emission", Color) = (0,0,0)
    }

    SubShader
    {
        Tags{ "RenderPipeline" = "HDRenderPipeline" "RenderType" = "Opaque" }

        HLSLINCLUDE
        #include "Packages/com.unity.render-pipelines.core/ShaderLibrary/Common.hlsl"
        #include "Packages/com.unity.render-pipelines.high-definition/Runtime/ShaderLibrary/ShaderVariables.hlsl"
        #include "Packages/com.unity.render-pipelines.high-definition/Runtime/Material/Material.hlsl"
        #include "Packages/com.unity.render-pipelines.high-definition/Runtime/Lighting/Lighting.hlsl"
        #include "Packages/com.unity.render-pipelines.high-definition/Runtime/Material/Lit/Lit.hlsl"
        ENDHLSL

        Pass
        {
            Name "Forward"
            Tags { "LightMode" = "Forward" }
            
            HLSLPROGRAM
            #pragma target 4.5
            #pragma multi_compile_instancing
            #pragma vertex Vert
            #pragma fragment Frag

            // SRP Batcher CBUFFER
            CBUFFER_START(UnityPerMaterial)
                float4 _AlbedoMap_ST;
                float _WindDisplacementMultiplier;

                // GroundAnimationController pushed globals
                float4 _WindDirection;
                float _WindStrength;
                float _WindFrequency;

                float3 _RippleOrigin;
                float _RippleRadius;
                float _RippleTime;
                
                float _GroundGlobalTime;

                float _WetFactor;
                float _PuddleCoverage;

                // Seed sent initialized per material instance for shimmer
                float _ShimmerSeed;
            CBUFFER_END

            TEXTURE2D(_AlbedoMap);  SAMPLER(sampler_AlbedoMap);
            TEXTURE2D(_NormalMap);  SAMPLER(sampler_NormalMap);

            struct Attributes
            {
                float3 positionOS : POSITION;
                float3 normalOS   : NORMAL;
                float4 tangentOS  : TANGENT;
                float2 uv         : TEXCOORD0;
                float4 color      : COLOR; // Used as wind weighting (e.g. top of grass=1, bottom=0)
                UNITY_VERTEX_INPUT_INSTANCE_ID
            };

            struct Varyings
            {
                float4 positionCS : SV_POSITION;
                float3 positionWS : TEXCOORD0;
                float3 normalWS   : TEXCOORD1;
                float4 tangentWS  : TEXCOORD2;
                float3 bitangentWS: TEXCOORD3;
                float2 uv         : TEXCOORD4;
                float  shimmerMask: TEXCOORD5;
                UNITY_VERTEX_INPUT_INSTANCE_ID
            };

            Varyings Vert(Attributes input)
            {
                Varyings output;
                UNITY_SETUP_INSTANCE_ID(input);
                UNITY_TRANSFER_INSTANCE_ID(input, output);

                float3 positionWS = TransformObjectToWorld(input.positionOS);
                
                // --- WIND ANIMATION ---
                // Simple sine wave based on world space pos dotted with wind dir
                float windPhase = dot(positionWS.xz, _WindDirection.xz) * _WindFrequency + _GroundGlobalTime * _WindStrength;
                
                // Displacement weighted by vertex color (typical for foliage to lock roots)
                float3 displacement = float3(_WindDirection.x, 0, _WindDirection.z) * (sin(windPhase) * 0.5 + 0.5);
                displacement *= input.color.r * _WindStrength * _WindDisplacementMultiplier;

                positionWS += displacement;
                
                output.positionWS = positionWS;
                output.positionCS = TransformWorldToHClip(positionWS);

                output.normalWS = TransformObjectToWorldNormal(input.normalOS);
                output.tangentWS = float4(TransformObjectToWorldDir(input.tangentOS.xyz), input.tangentOS.w);
                output.bitangentWS = cross(output.normalWS, output.tangentWS.xyz) * output.tangentOS.w;
                output.uv = input.uv * _AlbedoMap_ST.xy + _AlbedoMap_ST.zw;
                output.shimmerMask = saturate(sin(_ShimmerSeed + _GroundGlobalTime * 2.0));
                
                return output;
            }

            void Frag(Varyings input, out float4 outColor : SV_Target)
            {
                float3 albedo = SAMPLE_TEXTURE2D(_AlbedoMap, sampler_AlbedoMap, input.uv).rgb;
                float3 normalTS = UnpackNormal(SAMPLE_TEXTURE2D(_NormalMap, sampler_NormalMap, input.uv));

                // --- PUDDLE RIPPLES ---
                float distToRipple = distance(input.positionWS, _RippleOrigin);
                // Ripple band width
                float width = 0.5; 
                float inRippleBand = smoothstep(_RippleRadius - width, _RippleRadius, distToRipple) * smoothstep(_RippleRadius + width, _RippleRadius, distToRipple);
                
                // Add oscillating normal perturbation in the ring area
                float rippleOscillation = sin((distToRipple - _RippleRadius) * 20.0 - _RippleTime * 10.0);
                float rippleMask = inRippleBand * (1.0 - _RippleTime) * _WetFactor; // Fade outer edge and require wetness
                normalTS.xy += rippleOscillation * rippleMask * 0.5;

                // Normalize after perturbing
                normalTS = normalize(normalTS + float3(0,0,1e-6));

                // Shimmer on albedo just for visualization of the effect
                albedo += float3(0.05, 0.05, 0.05) * input.shimmerMask * _WetFactor;

                // Wetness darkening
                albedo = lerp(albedo, albedo * 0.4, _WetFactor);

                float3x3 tbn = float3x3(input.tangentWS.xyz, input.bitangentWS, input.normalWS);
                float3 normalWS = normalize(mul(normalTS, tbn));
                
                // Standard Lit
                outColor = float4(albedo * saturate(dot(normalWS, float3(0, 1, 0))), 1.0);
            }
            ENDHLSL
        }
    }
}
