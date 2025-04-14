const vshader = `
varying vec3 vPosition;
varying vec2 vUv;

void main() {	
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`
const fshader = `
#define PI2 6.28318530718

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_color;

varying vec2 vUv;
varying vec3 vPosition;

float circle(vec2 pt, vec2 center, float radius, float edge_thickness){
  vec2 p = pt - center;
  float len = length(p);
  float result = 1.0-smoothstep(radius-edge_thickness, radius, len);

  return result;
}

void main (void)
{
  vec3 color = u_color * circle(vPosition.xy, vec2(0.0), 0.3, 0.002);
  gl_FragColor = vec4(color, 1.0); 
}
`


const uniforms = {
  u_color: { value: new THREE.Color(0xffff00) },
  u_time: { value: 0.0 },
  u_mouse: { value:{ x:0.0, y:0.0 }},
  u_resolution: { value:{ x:0, y:0 }}
}


const shaderScene = new ShaderScene(vshader, fshader, uniforms);