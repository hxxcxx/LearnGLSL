const vshader = `
varying vec3 vPosition;

void main() {
  vPosition = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`
const fshader = `
uniform vec3 u_LightColor;
uniform vec3 u_DarkColor;
uniform float u_Frequency;
uniform float u_NoiseScale;
uniform float u_RingScale;
uniform float u_Contrast;

varying vec3 vPosition;

#include <noise>

void main(){
  float n = snoise( vPosition );
  float ring = fract( u_Frequency * vPosition.z + u_NoiseScale * n );
  ring *= u_Contrast * ( 1.0 - ring );

  // Adjust ring smoothness and shape, and add some noise
  float lerp = pow( ring, u_RingScale ) + n;
  vec3 color = mix(u_DarkColor, u_LightColor, lerp);

  gl_FragColor = vec4(color, 1.0);
}
`
//fract �������ǽ� vPosition ��ĳЩ������������ [0.0, 1.0) �ķ�Χ�ڣ�
// ��ᵼ�³��������Χ��ֵ��ѭ���ص��� 0.0���Ӷ������ظ���ͼ����

const fshader_perlin = `
uniform vec2 u_resolution;

varying vec3 vPosition;

#include <noise>

void main(){
  vec2 p = vPosition.xy;
  float scale = 800.0;
  vec3 color;
  bool marble = true;

  p *= scale;

  if (marble){
    float d = perlin(p.x, p.y) * scale;
    float u = p.x + d;
    float v = p.y + d;
    d = perlin(u, v) * scale;
    float noise = perlin(p.x + d, p.y + d);
    color = vec3(0.6 * (vec3(2.0 * noise) - vec3(noise * 0.1, noise * 0.2 - sin(u / 30.0) * 0.1, noise * 0.3 + sin(v / 40.0) * 0.2)));
  }else{
    color = vec3(perlin(p.x, p.y));
  }
  gl_FragColor = vec4(color, 1.0);
}
// `
//ʹ�� Perlin �������ɴ���ʯ����
//ͨ���Ŷ�����Ͷ��������������ϸ�ڡ�




const uniforms = {};
uniforms.u_time = { value: 0.0 };
uniforms.u_resolution = { value: new THREE.Vector2() };
uniforms.u_LightColor = { value: new THREE.Color(0xbb905d) };
uniforms.u_DarkColor = { value: new THREE.Color(0x7d490b) };
uniforms.u_Frequency = { value: 2.0 };
uniforms.u_NoiseScale = { value: 6.0 };
uniforms.u_RingScale = { value: 0.6 };
uniforms.u_Contrast = { value: 4.0 };



const shaderScene = new ShaderScene(vshader, fshader_texture2D, uniforms);