Shader "HDRP/Custom/RoadSurface"
{
    Properties
    {
        _AlbedoMap("Albedo", 2D) = "gray" {}
        _NormalMap("Normal", 2D) = "bump" {}
        _MaskMap("Metallic(R) Occlusion(G) Detail(B) Smoothness(A)", 2D) = "white" {}
        _CrackMap("Crack Details", 2D) = "black" {}

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
                float4 _CrackMap_ST;

                // GroundAnimationController pushed globals
                float _WetFactor;
                float _PuddleCoverage;
            CBUFFER_END

            TEXTURE2D(_AlbedoMap);  SAMPLER(sampler_AlbedoMap);
            TEXTURE2D(_NormalMap);  SAMPLER(sampler_NormalMap);
            TEXTURE2D(_MaskMap);    SAMPLER(sampler_MaskMap);
            TEXTURE2D(_CrackMap);   SAMPLER(sampler_CrackMap);

            struct Attributes
            {
                float3 positionOS : POSITION;
                float3 normalOS   : NORMAL;
                float4 tangentOS  : TANGENT;
                float2 uv         : TEXCOORD0;
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
                UNITY_VERTEX_INPUT_INSTANCE_ID
            };

            Varyings Vert(Attributes input)
            {
                Varyings output;
                UNITY_SETUP_INSTANCE_ID(input);
                UNITY_TRANSFER_INSTANCE_ID(input, output);

                float3 positionWS = TransformObjectToWorld(input.positionOS);
                output.positionWS = positionWS;
                output.positionCS = TransformWorldToHClip(positionWS);

                output.normalWS = TransformObjectToWorldNormal(input.normalOS);
                output.tangentWS = float4(TransformObjectToWorldDir(input.tangentOS.xyz), input.tangentOS.w);
                output.bitangentWS = cross(output.normalWS, output.tangentWS.xyz) * output.tangentOS.w;
                output.uv = input.uv * _AlbedoMap_ST.xy + _AlbedoMap_ST.zw;
                return output;
            }

            void Frag(Varyings input, out float4 outColor : SV_Target)
            {
                float3 albedo = SAMPLE_TEXTURE2D(_AlbedoMap, sampler_AlbedoMap, input.uv).rgb;
                float3 normalTS = UnpackNormal(SAMPLE_TEXTURE2D(_NormalMap, sampler_NormalMap, input.uv));
                float4 mask = SAMPLE_TEXTURE2D(_MaskMap, sampler_MaskMap, input.uv);
                float crack = SAMPLE_TEXTURE2D(_CrackMap, sampler_CrackMap, input.uv * _CrackMap_ST.xy + _CrackMap_ST.zw).r;

                albedo *= lerp(1.0, 0.2, crack);
                
                // Extremely simple porosity darkening for wetness
                albedo = lerp(albedo, albedo * 0.3, _WetFactor * mask.a);
                float smoothness = lerp(mask.a, 0.95, _WetFactor);

                // Flatten normal map in puddles
                normalTS = lerp(normalTS, float3(0,0,1), _WetFactor * crack * _PuddleCoverage);

                // Setup TBN WS
                float3x3 tbn = float3x3(input.tangentWS.xyz, input.bitangentWS, input.normalWS);
                float3 normalWS = normalize(mul(normalTS, tbn));
                
                // Lit Output (simplified logic)
                outColor = float4(albedo * saturate(dot(normalWS, float3(0, 1, 0))), 1.0);
            }
            ENDHLSL
        }
    }
}
