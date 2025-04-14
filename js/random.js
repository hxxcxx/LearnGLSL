const vshader = `
varying vec2 vUv;
void main() {	
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`
const fshader = `
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

varying vec2 vUv;

float random (vec2 st) {
  const float a = 12.9898;
  const float b = 78.233;
  const float c = 43758.543123;
  return fract(sin(dot(st.xy, vec2(a, b))) * c );
}

void main(){    
  vec3 color = random(vUv)*vec3(1.0);
	gl_FragColor  = vec4(color, 1.0);
}
`

const fshader_random_time = `
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

varying vec2 vUv;

float random (vec2 st, float seed) {
  return fract(sin(dot(st*(1.0 + seed), vec2(12.9898,78.233))) * 43758.543123 );
}

void main(){    
  vec3 color = random(vUv, u_time)*vec3(1.0);
	gl_FragColor  = vec4(color, 1.0);
}
`
const fshader_noise = `
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

varying vec2 vUv;

// 2D Random
float random (vec2 st) {
    return fract(sin(dot(st, vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {
    vec2 st = vUv;

    // Scale the coordinate system to see
    // some noise in action
    vec2 pos = vec2(st*8.0);

    // Use the noise function
    float n = noise(pos);
    //n = smoothstep(0.4, 0.6, n);

    gl_FragColor = vec4(vec3(n), 1.0);
}
`
const fshader_noise_time = `
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

varying vec2 vUv;

// 2D Random
float random (vec2 st) {
    return fract(sin(dot(st, vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {
    vec2 st = vUv;

    // Scale the coordinate system to see
    // some noise in action
    vec2 pos = vec2(st*8.0);
    pos.y -= u_time;

    // Use the noise function
    float n = noise(pos);

    gl_FragColor = vec4(vec3(n), 1.0);
}
`


const fshader_noise_time_fract = `
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform vec3 u_color_a;
uniform vec3 u_color_b;

varying vec2 vUv;

// 2D Random
float random (vec2 st) {
    return fract(sin(dot(st, vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {
    vec2 n = vec2(0.0);
    vec2 pos;

    //Generate noise x value
    pos = vec2(vUv.x*1.4 + 0.01, vUv.y - u_time*0.69);
    n.x = noise(pos*12.0);
    pos = vec2(vUv.x*0.5 - 0.033, vUv.y*2.0 - u_time*0.12);
    n.x += noise(pos*8.0);
    pos = vec2(vUv.x*0.94 + 0.02, vUv.y*3.0 - u_time*0.61);
    n.x += noise(pos*4.0);

    // Generate noise y value
    pos = vec2(vUv.x*0.7 - 0.01, vUv.y - u_time*0.27);
    n.y = noise(pos*12.0);
    pos = vec2(vUv.x*0.45 + 0.033, vUv.y*1.9 - u_time*0.61);
    n.y += noise(pos*8.0);
    pos = vec2(vUv.x*0.8 - 0.02, vUv.y*2.5 - u_time*0.51);
    n.y += noise(pos*4.0);
    
    n /= 2.3;


    vec3 color = mix(u_color_a, u_color_b, n.y*n.x);

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


const shaderScene = new ShaderScene(vshader, fshader_noise_time_fract, uniforms);