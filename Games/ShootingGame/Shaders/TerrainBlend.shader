Shader "HDRP/Custom/TerrainBlend"
{
    Properties
    {
        [Header(Splat Maps)]
        _Control("Control (Alpha Map)", 2D) = "red" {}
        [Header(Layer 0 - Grass)]
        _Splat0("Albedo", 2D) = "white" {}
        _Normal0("Normal", 2D) = "bump" {}
        _Smoothness0("Smoothness", Range(0,1)) = 0.5
        _Metallic0("Metallic", Range(0,1)) = 0.0
        [Header(Layer 1 - Dirt)]
        _Splat1("Albedo", 2D) = "white" {}
        _Normal1("Normal", 2D) = "bump" {}
        _Smoothness1("Smoothness", Range(0,1)) = 0.5
        _Metallic1("Metallic", Range(0,1)) = 0.0
        [Header(Layer 2 - Mud)]
        _Splat2("Albedo", 2D) = "white" {}
        _Normal2("Normal", 2D) = "bump" {}
        _Smoothness2("Smoothness", Range(0,1)) = 0.5
        _Metallic2("Metallic", Range(0,1)) = 0.0
        [Header(Layer 3 - Rock)]
        _Splat3("Albedo", 2D) = "white" {}
        _Normal3("Normal", 2D) = "bump" {}
        _Smoothness3("Smoothness", Range(0,1)) = 0.5
        _Metallic3("Metallic", Range(0,1)) = 0.0
        [Header(Wetness Global)]
        _PuddleColor("Puddle Color", Color) = (0.05, 0.05, 0.05, 1)
        
        // Hide these from inspector, managed by Unity/Material
        [HideInInspector] _EmissionColor("Emission Color", Color) = (0,0,0)
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
                float4 _Splat0_ST;
                float4 _Splat1_ST;
                float4 _Splat2_ST;
                float4 _Splat3_ST;

                float _Smoothness0;
                float _Smoothness1;
                float _Smoothness2;
                float _Smoothness3;

                float _Metallic0;
                float _Metallic1;
                float _Metallic2;
                float _Metallic3;
                
                float4 _PuddleColor;

                // GroundAnimationController pushed globals
                float _WetFactor;
                float _PuddleCoverage;
            CBUFFER_END

            TEXTURE2D(_Control);  SAMPLER(sampler_Control);
            
            TEXTURE2D(_Splat0);   SAMPLER(sampler_Splat0);
            TEXTURE2D(_Normal0);  SAMPLER(sampler_Normal0);
            TEXTURE2D(_Splat1);   SAMPLER(sampler_Splat1);
            TEXTURE2D(_Normal1);  SAMPLER(sampler_Normal1);
            TEXTURE2D(_Splat2);   SAMPLER(sampler_Splat2);
            TEXTURE2D(_Normal2);  SAMPLER(sampler_Normal2);
            TEXTURE2D(_Splat3);   SAMPLER(sampler_Splat3);
            TEXTURE2D(_Normal3);  SAMPLER(sampler_Normal3);

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
                float2 uv         : TEXCOORD3;
                float4 tangentWS  : TEXCOORD4;
                float3 bitangentWS: TEXCOORD5;
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
                output.uv = input.uv;
                return output;
            }

            void Frag(Varyings input, out float4 outColor : SV_Target)
            {
                // Unpack control map
                float4 splatControl = SAMPLE_TEXTURE2D(_Control, sampler_Control, input.uv);

                // Sample layer 0
                float2 uv0 = input.uv * _Splat0_ST.xy + _Splat0_ST.zw;
                float3 albedo0 = SAMPLE_TEXTURE2D(_Splat0, sampler_Splat0, uv0).rgb;
                float3 normal0 = UnpackNormal(SAMPLE_TEXTURE2D(_Normal0, sampler_Normal0, uv0));
                
                // Sample layer 1
                float2 uv1 = input.uv * _Splat1_ST.xy + _Splat1_ST.zw;
                float3 albedo1 = SAMPLE_TEXTURE2D(_Splat1, sampler_Splat1, uv1).rgb;
                float3 normal1 = UnpackNormal(SAMPLE_TEXTURE2D(_Normal1, sampler_Normal1, uv1));

                // Sample layer 2
                float2 uv2 = input.uv * _Splat2_ST.xy + _Splat2_ST.zw;
                float3 albedo2 = SAMPLE_TEXTURE2D(_Splat2, sampler_Splat2, uv2).rgb;
                float3 normal2 = UnpackNormal(SAMPLE_TEXTURE2D(_Normal2, sampler_Normal2, uv2));

                // Sample layer 3
                float2 uv3 = input.uv * _Splat3_ST.xy + _Splat3_ST.zw;
                float3 albedo3 = SAMPLE_TEXTURE2D(_Splat3, sampler_Splat3, uv3).rgb;
                float3 normal3 = UnpackNormal(SAMPLE_TEXTURE2D(_Normal3, sampler_Normal3, uv3));

                // Blend
                float3 albedo = albedo0 * splatControl.r + albedo1 * splatControl.g + albedo2 * splatControl.b + albedo3 * splatControl.a;
                float3 normalTS = normal0 * splatControl.r + normal1 * splatControl.g + normal2 * splatControl.b + normal3 * splatControl.a;
                float smoothness = _Smoothness0 * splatControl.r + _Smoothness1 * splatControl.g + _Smoothness2 * splatControl.b + _Smoothness3 * splatControl.a;
                float metallic = _Metallic0 * splatControl.r + _Metallic1 * splatControl.g + _Metallic2 * splatControl.b + _Metallic3 * splatControl.a;

                // Wetness modifier
                float isPuddle = (splatControl.b > 0.5) ? saturate(_PuddleCoverage * 2.0) : _PuddleCoverage;
                albedo = lerp(albedo, albedo * _PuddleColor.rgb, isPuddle);
                smoothness = lerp(smoothness, 0.95, isPuddle);
                normalTS = lerp(normalTS, float3(0,0,1), isPuddle * 0.8);

                // TBN
                float3x3 tbn = float3x3(input.tangentWS.xyz, input.bitangentWS, input.normalWS);
                float3 normalWS = normalize(mul(normalTS, tbn));

                // Extremely simplified lit output (for prototype compilation)
                // In full HDRP, we'd populate SurfaceData and BuiltinData.
                
                outColor = float4(albedo * max(0.1, dot(normalWS, float3(0, 1, 0))), 1.0);
            }
            ENDHLSL
        }
    }
}
