
const vshader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {	
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`
const fshader = `
#define PI 3.141592653589
#define PI2 6.28318530718

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;

varying vec2 vUv;

float brick(vec2 pt, float mortar_height, float edge_thickness){
  if (pt.y>0.5) pt.x = fract(pt.x + 0.5);
  float half_mortar_height = mortar_height/2.0;
  //Draw vertical lines
  float result = smoothstep(-half_mortar_height - edge_thickness, -half_mortar_height, pt.x) - smoothstep(half_mortar_height, half_mortar_height + edge_thickness, pt.x) + smoothstep(1.0-half_mortar_height-edge_thickness, 1.0-half_mortar_height, pt.x);
  //Draw top and bottom lines
  result += smoothstep(-half_mortar_height - edge_thickness, -half_mortar_height, pt.y) - smoothstep(half_mortar_height, half_mortar_height + edge_thickness, pt.y);
  //Draw middle line
  result += smoothstep(0.5 - half_mortar_height - edge_thickness, 0.5 - half_mortar_height, pt.y) - smoothstep(0.5 + half_mortar_height, 0.5 + half_mortar_height + edge_thickness, pt.y);
  return result;
}

void main (void)
{
  vec2 uv = fract(vUv * 1.0);
  vec3 color = brick(uv, 0.05, 0.001) * vec3(1.0);
  gl_FragColor = vec4(color, 1.0); 
}
`

const fshader_fract = `
#define PI 3.141592653589
#define PI2 6.28318530718

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_color_a;
uniform vec3 u_color_b;

varying vec2 vUv;

float brick(vec2 pt, float mortar_height, float edge_thickness){
  if (pt.y>0.5) pt.x = fract(pt.x + 0.5);
  //Draw vertical lines
  float result = 1.0 - smoothstep(mortar_height/2.0, mortar_height/2.0 + edge_thickness, pt.x) + smoothstep(1.0 - mortar_height/2.0 - edge_thickness, 1.0 - mortar_height/2.0, pt.x);
  //Draw top and bottom lines
  result += 1.0 - smoothstep(mortar_height/2.0, mortar_height/2.0 + edge_thickness, pt.y) + smoothstep(1.0 - mortar_height/2.0 - edge_thickness, 1.0 - mortar_height/2.0, pt.y);
  //Draw middle line
  result += smoothstep(0.5 - mortar_height/2.0 - edge_thickness, 0.5 - mortar_height/2.0, pt.y) - smoothstep(0.5 + mortar_height/2.0, 0.5 + mortar_height/2.0 + edge_thickness, pt.y);
  return result;
}

void main (void)
{
  vec2 uv = fract(vUv * 1.0);
  vec3 color = mix(u_color_a, u_color_b, brick(uv, 0.05, 0.001));
  gl_FragColor = vec4(color, 1.0); 
}
`

const fshader_fract1 = `
#define PI 3.141592653589
#define PI2 6.28318530718

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_color_a;
uniform vec3 u_color_b;

varying vec2 vUv;

float brick(vec2 pt, float mortar_height, float edge_thickness){
  if (pt.y>0.5) pt.x = fract(pt.x + 0.5);
  //Draw vertical lines
  float result = 1.0 - smoothstep(mortar_height/2.0, mortar_height/2.0 + edge_thickness, pt.x) + smoothstep(1.0 - mortar_height/2.0 - edge_thickness, 1.0 - mortar_height/2.0, pt.x);
  //Draw top and bottom lines
  result += 1.0 - smoothstep(mortar_height/2.0, mortar_height/2.0 + edge_thickness, pt.y) + smoothstep(1.0 - mortar_height/2.0 - edge_thickness, 1.0 - mortar_height/2.0, pt.y);
  //Draw middle line
  result += smoothstep(0.5 - mortar_height/2.0 - edge_thickness, 0.5 - mortar_height/2.0, pt.y) - smoothstep(0.5 + mortar_height/2.0, 0.5 + mortar_height/2.0 + edge_thickness, pt.y);
  return clamp(result, 0.0, 1.0);
}

void main (void)
{
  vec2 uv = fract(vUv * 10.0);
  vec3 color = mix(u_color_a, u_color_b, brick(uv, 0.05, 0.001));
  gl_FragColor = vec4(color, 1.0); 
}
`



const uniforms = {
  u_color_a: { value: new THREE.Color(0xff0000) },
  u_color_b: { value: new THREE.Color(0x00ffff) },
  u_time: { value: 0.0 },
  u_mouse: { value:{ x:0.0, y:0.0 }},
  u_resolution: { value:{ x:0, y:0 }}
}


const shaderScene = new ShaderScene(vshader, fshader_fract1, uniforms);