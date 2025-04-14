
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
#define PI2 6.28318530718

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;

varying vec2 vUv;
varying vec3 vPosition;

float line(float x, float y, float line_width, float edge_width){
  return smoothstep(x-line_width/2.0-edge_width, x-line_width/2.0, y) - smoothstep(x+line_width/2.0, x+line_width/2.0+edge_width, y);
}

void main (void)
{
  vec2 uv = gl_FragCoord.xy;
  vec3 color = mix(vec3(0.0), vec3(1.0), line(uv.x, uv.y, 10.0, 1.0));
  gl_FragColor = vec4(color, 1.0); 
}
`
const fshader_sin = `
#define PI2 6.28318530718

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_color;

varying vec2 vUv;
varying vec3 vPosition;

float getDelta(float x){
  return (sin(x)+1.0)/2.0;
}

float line(float x, float y, float line_width, float edge_width){
  return smoothstep(x-line_width/2.0-edge_width, x-line_width/2.0, y) - smoothstep(x+line_width/2.0, x+line_width/2.0+edge_width, y);
}

void main (void)
{
  vec3 color = u_color * line(vUv.y, mix(0.2, 0.8, getDelta(vPosition.x*PI2)), 0.005, 0.002);
  color += line(vUv.x, 0.5, 0.002, 0.001)*vec3(0.5);
  color += line(vUv.y, 0.5, 0.002, 0.001)*vec3(0.5);

  gl_FragColor = vec4(color, 1.0); 
}
`


const uniforms = {
  u_color: { value: new THREE.Color(0xffff00) },
  u_time: { value: 0.0 },
  u_mouse: { value:{ x:0.0, y:0.0 }},
  u_resolution: { value:{ x:0, y:0 }}
}



const shaderScene = new ShaderScene(vshader, fshader_sin, uniforms);