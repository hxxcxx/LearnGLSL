const vshader = `
varying vec2 vUv;
void main() {	
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`
const fshader = `
#define PI 3.141592653589
#define PI2 6.28318530718

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform sampler2D u_tex;
uniform float u_time;

varying vec2 vUv;

//Based on http://clockworkchilli.com/blog/8_a_fire_shader_in_glsl_for_your_webgl_games

void main (void)
{
  vec4 col;
  vec3 color;
  if (vUv.x<0.5){
    if (vUv.y<0.5){
      col = texture2D(u_tex, vUv*2.0);
      color = vec3(col.b);
    }else{
      col = texture2D(u_tex, vUv*2.0-vec2(0.0, 1.0));
      color = vec3(col.r);
    }
  }else{
    if (vUv.y<0.5){
      col = texture2D(u_tex, vUv*2.0-vec2(1.0, 0.0));
      color = vec3(col.a);
    }else{
      col = texture2D(u_tex, vUv*2.0-vec2(1.0, 1.0));
      color = vec3(col.g);
    }
  }

  gl_FragColor = vec4(color, 1.0);
}
`
const fshader_offset = `
#define PI 3.141592653589
#define PI2 6.28318530718

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform sampler2D u_tex;
uniform float u_time;

varying vec2 vUv;

//Based on http://clockworkchilli.com/blog/8_a_fire_shader_in_glsl_for_your_webgl_games

void main (void)
{
  vec4 col;
  vec3 color;
  vec2 offset = vec2(u_time/4.0);
  if (vUv.x<0.5){
    if (vUv.y<0.5){
      col = texture2D(u_tex, vUv*2.0);
      color = vec3(col.b);
    }else{
      col = texture2D(u_tex, fract(vUv*2.0-vec2(0.0, 1.0)+offset));
      color = vec3(col.r);
    }
  }else{
    if (vUv.y<0.5){
      col = texture2D(u_tex, fract(vUv*2.0-vec2(1.0, 0.0)-offset));
      color = vec3(col.a);
    }else{
      col = texture2D(u_tex, fract(vUv*2.0-vec2(1.0, 1.0)+offset));
      color = vec3(col.g);
    }
  }

  gl_FragColor = vec4(color, 1.0);
}
`
const fshader_noise = `
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_tex;

varying vec2 vUv;

void main() {
  vec2 uv;
  vec2 noise = vec2(0.0);

  // Generate noisy y value
  uv = vec2(vUv.x*0.7 - 0.01, fract(vUv.y - u_time*0.27));
  noise.y = (texture2D(u_tex, uv).a-0.5)*2.0;
  uv = vec2(vUv.x*0.45 + 0.033, fract(vUv.y*1.9 - u_time*0.61));
  noise.y += (texture2D(u_tex, uv).a-0.5)*2.0;
  uv = vec2(vUv.x*0.8 - 0.02, fract(vUv.y*2.5 - u_time*0.51));
  noise.y += (texture2D(u_tex, uv).a-0.5)*2.0;
  
  noise = clamp(noise, -1.0, 1.0);

  float perturb = (1.0 - vUv.y) * 0.35 + 0.02;
  noise = (noise * perturb) + vUv - 0.02;

  vec4 color = texture2D(u_tex, noise);
  color = vec4(color.r*2.0, color.g*0.9, (color.g/color.r)*0.2, 1.0);
  noise = clamp(noise, 0.05, 1.0);
  color.a = texture2D(u_tex, noise).b*2.0;
  color.a = color.a*texture2D(u_tex, vUv).b;

  gl_FragColor = color;
}
`
const vshader1 = `
varying vec2 vUv;
void main() {	
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`
const fshader_noise_time = `
#define PI 3.141592653589
#define PI2 6.28318530718

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform sampler2D u_tex;
uniform float u_time;

varying vec2 vUv;

//Based on http://clockworkchilli.com/blog/8_a_fire_shader_in_glsl_for_your_webgl_games

void main (void)
{
  vec2 noise = vec2(0.0);
  float time = u_time;

  // Generate noisy x value
  vec2 uv = vec2(vUv.x*1.4 + 0.01, fract(vUv.y - time*0.69));
  noise.x = (texture2D(u_tex, uv).w-0.5)*2.0;
  uv = vec2(vUv.x*0.5 - 0.033, fract(vUv.y*2.0 - time*0.12));
  noise.x += (texture2D(u_tex, uv).w-0.5)*2.0;
  uv = vec2(vUv.x*0.94 + 0.02, fract(vUv.y*3.0 - time*0.61));
  noise.x += (texture2D(u_tex, uv).w-0.5)*2.0;
  
  // Generate noisy y value
  uv = vec2(vUv.x*0.7 - 0.01, fract(vUv.y - time*0.27));
  noise.y = (texture2D(u_tex, uv).w-0.5)*2.0;
  uv = vec2(vUv.x*0.45 + 0.033, fract(vUv.y*1.9 - time*0.61));
  noise.y = (texture2D(u_tex, uv).w-0.5)*2.0;
  uv = vec2(vUv.x*0.8 - 0.02, fract(vUv.y*2.5 - time*0.51));
  noise.y += (texture2D(u_tex, uv).w-0.5)*2.0;
  
  noise = clamp(noise, -1.0, 1.0);

  float perturb = (1.0 - vUv.y) * 0.35 + 0.02;
  noise = (noise * perturb) + vUv - 0.02;

  vec4 color = texture2D(u_tex, noise);
  color = vec4(color.r*2.0, color.g*0.9, (color.g/color.r)*0.2, 1.0);
  noise = clamp(noise, 0.05, 1.0);
  color.a = texture2D(u_tex, noise).b*2.0;
  color.a = color.a*texture2D(u_tex, vUv).b;

  gl_FragColor = color;
}
`
const vshader_texture2D = `
varying vec2 vUv;
void main() {	
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`
const fshader_texture2D = `
#define PI 3.141592653589
#define PI2 6.28318530718

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_tex;

varying vec2 vUv;

vec2 rotate(vec2 pt, float theta){
  float c = cos(theta);
  float s = sin(theta);
  mat2 mat = mat2(c,s,-s,c);
  return mat * pt;
}

void main (void)
{
  vec2 uv = vUv;
  vec3 color = texture2D(u_tex, uv).rgb;
  gl_FragColor = vec4(color, 1.0); 
}
`
const fshader_rotate = `
#define PI 3.141592653589
#define PI2 6.28318530718

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_tex;

varying vec2 vUv;

vec2 rotate(vec2 pt, float theta){
  float c = cos(theta);
  float s = sin(theta);
  float aspect = 2.0/1.5;
  mat2 mat = mat2(c,s,-s,c);
  pt.y /= aspect;
  pt = mat * pt;
  pt.y *= aspect;
  return pt;
}

void main (void)
{
  vec2 uv = vUv;
  uv -= vec2(0.5);
  uv = rotate(uv, u_time);
  uv += vec2(0.5);
  vec3 color;
  if (uv.x<0.0||uv.x>1.0||uv.y<0.0||uv.y>1.0){
    color = vec3(0.0);
  }else{
    color = texture2D(u_tex, uv).rgb;
  }
  gl_FragColor = vec4(color, 1.0); 
}
`
const fshader_ripple = `
#define PI 3.141592653589
#define PI2 6.28318530718

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_duration;
uniform sampler2D u_tex;

varying vec2 vUv;

void main (void)
{
  vec2 p = vUv*2.0 - 1.0;
  float len = length(p);
  vec2 ripple = vUv + p/len*0.03*cos(len*12.0-u_time*4.0);
  float delta = (((sin(u_time)+1.0)/2.0)* u_duration)/u_duration;
  vec2 uv = mix(ripple, vUv, delta);
  vec3 color = texture2D(u_tex, uv).rgb;
  gl_FragColor = vec4(color, 1.0); 
}
`

// const uniforms = {
//   u_tex: { value: new THREE.TextureLoader().load("https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/flame.png") },
//   u_time: { value: 0.0 },
//   u_mouse: { value:{ x:0.0, y:0.0 }},
//   u_resolution: { value:{ x:0, y:0 }}
// }
// const uniforms = {
//   u_tex: { value: new THREE.TextureLoader().load("https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/sa1.jpg") },
//   u_time: { value: 0.0 },
//   u_mouse: { value:{ x:0.0, y:0.0 }},
//   u_resolution: { value:{ x:0, y:0 }}
// }

//ÖÐÐÄÁ°äô
const uniforms = {
  u_tex: { value: new THREE.TextureLoader().load("https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/sa1.jpg") },
  u_duration: { value: 2.0 },
  u_time: { value: 0.0 },
  u_mouse: { value:{ x:0.0, y:0.0 }},
  u_resolution: { value:{ x:0, y:0 }}
}



const shaderScene = new ShaderScene(vshader_texture2D, fshader_ripple, uniforms);