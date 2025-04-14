
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


float circle(vec2 pt, vec2 center, float radius, float line_width, float edge_thickness){
  pt -= center;
  float len = length(pt);
  //Change true to false to soften the edge
  float result = smoothstep(radius-line_width/2.0-edge_thickness, radius-line_width/2.0, len) - smoothstep(radius + line_width/2.0, radius + line_width/2.0 + edge_thickness, len);

  return result;
}

float line(float x, float y, float line_width, float edge_thickness){
  return smoothstep(x-line_width/2.0-edge_thickness, x-line_width/2.0, y) - smoothstep(x+line_width/2.0, x+line_width/2.0+edge_thickness, y);
}

void main (void)
{
  vec3 axis_color = vec3(0.8);
  vec3 color = line(vUv.y, 0.5, 0.002, 0.001) * axis_color;//xAxis
  color += line(vUv.x, 0.5, 0.002, 0.001) * axis_color;//yAxis
  color += circle(vUv, vec2(0.5), 0.3, 0.002, 0.001) * axis_color;
  color += circle(vUv, vec2(0.5), 0.2, 0.002, 0.001) * axis_color;
  color += circle(vUv, vec2(0.5), 0.1, 0.002, 0.001) * axis_color;
  gl_FragColor = vec4(color, 1.0); 
}
`
const fshader_sweep = `
#define PI2 6.28318530718

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;

varying vec2 vUv;

float getDelta(float val){
  return (sin(val)+1.0)/2.0;
}

float circle(vec2 pt, vec2 center, float radius, float line_width, float edge_thickness){
  pt -= center;
  float len = length(pt);
  //Change true to false to soften the edge
  float result = smoothstep(radius-line_width/2.0-edge_thickness, radius-line_width/2.0, len) - smoothstep(radius + line_width/2.0, radius + line_width/2.0 + edge_thickness/2.0, len);

  return result;
}

float line(float x, float y, float line_width){
  return smoothstep(x-line_width/2.0, x, y) - smoothstep(x, x+line_width/2.0, y);
}

float sweep(vec2 pt, vec2 center, float radius, float line_width, float edge_thickness){
  vec2 d = pt - center;
  float theta = fract(u_time/4.0) * PI2;
  vec2 p = vec2(cos(theta), -sin(theta))*radius;
  float h = clamp( dot(d,p)/dot(p,p), 0.0, 1.0 );
  //float h = dot(d,p)/dot(p,p);
  float l = length(d - p*h);

  return 1.0 - smoothstep(line_width, line_width+edge_thickness, l);
}

void main (void)
{
  vec3 axis_color = vec3(0.8);
  vec3 color = line(vUv.y, 0.5, 0.002) * axis_color;//xAxis
  color += line(vUv.x, 0.5, 0.002) * axis_color;//yAxis
  color += circle(vUv, vec2(0.5), 0.3, 0.002, 0.001) * axis_color;
  color += circle(vUv, vec2(0.5), 0.2, 0.002, 0.001) * axis_color;
  color += circle(vUv, vec2(0.5), 0.1, 0.002, 0.001) * axis_color;
  color += sweep(vUv, vec2(0.5), 0.3, 0.003, 0.001) * vec3(0.1, 0.3, 1.0);
  gl_FragColor = vec4(color, 1.0); 
}
`

const fshader_sweep1 = `
#define PI2 6.28318530718

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;

varying vec2 vUv;

float getDelta(float val){
  return (sin(val)+1.0)/2.0;
}

float circle(vec2 pt, vec2 center, float radius, float line_width, float edge_thickness){
  pt -= center;
  float len = length(pt);
  //Change true to false to soften the edge
  float result = smoothstep(radius-line_width/2.0-edge_thickness, radius-line_width/2.0, len) - smoothstep(radius + line_width/2.0, radius + line_width/2.0 + edge_thickness/2.0, len);

  return result;
}

float line(float x, float y, float line_width){
  return smoothstep(x-line_width/2.0, x, y) - smoothstep(x, x+line_width/2.0, y);
}

float sweep(vec2 pt, vec2 center, float radius, float line_width, float edge_thickness){
  vec2 d = pt - center;
  float theta = fract(u_time/4.0) * PI2;
  vec2 p = vec2(cos(theta), sin(theta))*radius;
  float h = clamp( dot(d,p)/dot(p,p), 0.0, 1.0 );
  //float h = dot(d,p)/dot(p,p);
  float l = length(d - p*h);

  float gradient = 0.0;
  const float gradient_angle = 1.0;

  if (length(d)<radius){
    float angle = mod( theta - atan(d.y, d.x), PI2);
    gradient = clamp(gradient_angle - angle, 0.0, gradient_angle) * 0.5;
  }

  return gradient + 1.0 - smoothstep(line_width, line_width+edge_thickness, l);
}

float sweep1(vec2 pt, vec2 center, float radius, float line_width, float edge_thickness){
  vec2 d = pt - center;
    
    // 1. 顺时针旋转参数
    float theta = fract(u_time/4.0) * PI2;
    vec2 dir = vec2(cos(theta), -sin(theta)); // 顺时针方向向量
    
    // 2. 扫描线主干计算
    float h = clamp(dot(d, dir)/dot(dir, dir), 0.0, 1.0);
    // float dist_to_line = length(d - dir*h);
    float dist_to_line = length(d - dir*h);

    float line = 1.0 - smoothstep(line_width, line_width+edge_thickness, dist_to_line);
    
    // 3. 正确的光晕计算（只在前进方向）
    float gradient = 0.0;
    const float gradient_width = 0.5; // 光晕宽度（弧度）
    
    if (length(d) < radius) {
        // 计算当前点相对于扫描线的角度差
        float angle_diff = mod(atan(dir.y, dir.x) - atan(d.y, d.x) + PI2, PI2);
        
        // 只在扫描线前方一定角度内产生光晕
        if (angle_diff < gradient_width) {
            gradient = (1.0 - angle_diff/gradient_width) * 0.5;
        }
    }
    
    // 4. 组合效果
    return line + gradient;
}

void main (void)
{
  vec3 axis_color = vec3(0.8);
  vec3 color = line(vUv.y, 0.5, 0.002) * axis_color;//xAxis
  color += line(vUv.x, 0.5, 0.002) * axis_color;//yAxis
  color += circle(vUv, vec2(0.5), 0.3, 0.002, 0.001) * axis_color;
  color += circle(vUv, vec2(0.5), 0.2, 0.002, 0.001) * axis_color;
  color += circle(vUv, vec2(0.5), 0.1, 0.002, 0.001) * axis_color;
  color += sweep(vUv, vec2(0.5), 0.3, 0.003, 0.001) * vec3(0.1, 0.3, 1.0);
  gl_FragColor = vec4(color, 1.0); 
}
`
const fshader_polygon = `
#define PI 3.141592653589
#define PI2 6.28318530718

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;

varying vec2 vUv;

float getDelta(float val){
  return (sin(val)+1.0)/2.0;
}

float circle(vec2 pt, vec2 center, float radius, float line_width, float edge_thickness){
  pt -= center;
  float len = length(pt);
  //Change true to false to soften the edge
  float result = smoothstep(radius-line_width/2.0-edge_thickness, radius-line_width/2.0, len) - smoothstep(radius + line_width/2.0, radius + line_width/2.0 + edge_thickness/2.0, len);

  return result;
}

float line(float x, float y, float line_width){
  return smoothstep(x-line_width/2.0, x, y) - smoothstep(x, x+line_width/2.0, y);
}

float sweep(vec2 pt, vec2 center, float radius, float line_width, float edge_thickness){
  vec2 d = pt - center;
  float theta = fract(u_time/4.0) * PI2;
  vec2 p = vec2(cos(theta), sin(theta))*radius;
  float h = clamp( dot(d,p)/dot(p,p), 0.0, 1.0 );
  //float h = dot(d,p)/dot(p,p);
  float l = length(d - p*h);

  float gradient = 0.0;
  const float gradient_angle = 1.0;

  if (length(d)<radius){
    float angle = mod( theta - atan(d.y, d.x), PI2);
    gradient = clamp(gradient_angle - angle, 0.0, gradient_angle) * 0.5;
  }

  return gradient + 1.0 - smoothstep(line_width, line_width+edge_thickness, l);
}

float polygon(vec2 pt, vec2 center, float radius, int sides, float rotate, float edge_thickness){
  pt -= center;
  
  // Angle and radius from the current pixel
  float theta = atan(pt.y, pt.x) + rotate;
  float rad = PI2/float(sides);

  // Shaping function that modulate the distance
  float d = cos(floor(0.5 + theta/rad)*rad-theta)*length(pt);

  return 1.0 - smoothstep(radius, radius + edge_thickness, d);
}

void main (void)
{
  vec3 axis_color = vec3(0.8);
  vec3 color = line(vUv.y, 0.5, 0.002) * axis_color;//xAxis
  color += line(vUv.x, 0.5, 0.002) * axis_color;//yAxis
  color += circle(vUv, vec2(0.5), 0.3, 0.002, 0.001) * axis_color;
  color += circle(vUv, vec2(0.5), 0.2, 0.002, 0.001) * axis_color;
  color += circle(vUv, vec2(0.5), 0.1, 0.002, 0.001) * axis_color;
  color += sweep(vUv, vec2(0.5), 0.3, 0.003, 0.001) * vec3(0.1, 0.3, 1.0);
  color += polygon(vUv, vec2(0.9 - sin(u_time*3.0)*0.05, 0.5), 0.005, 3, 0.0, 0.001) * vec3(1.0);
  color += polygon(vUv, vec2(0.1 - sin(u_time*3.0+PI)*0.05, 0.5), 0.005, 3, PI, 0.001) * vec3(1.0); 
  //Try adding animated triangles to the y axis
  gl_FragColor = vec4(color, 1.0); 
}
`
const fshader_4polygon = `
#define PI 3.141592653589
#define PI2 6.28318530718

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;

varying vec2 vUv;

float getDelta(float val){
  return (sin(val)+1.0)/2.0;
}

float circle(vec2 pt, vec2 center, float radius, float line_width, float edge_thickness){
  pt -= center;
  float len = length(pt);
  //Change true to false to soften the edge
  float result = smoothstep(radius-line_width/2.0-edge_thickness, radius-line_width/2.0, len) - smoothstep(radius + line_width/2.0, radius + line_width/2.0 + edge_thickness/2.0, len);

  return result;
}

float line(float x, float y, float line_width){
  return smoothstep(x-line_width/2.0, x, y) - smoothstep(x, x+line_width/2.0, y);
}

float sweep(vec2 pt, vec2 center, float radius, float line_width, float edge_thickness){
  vec2 d = pt - center;
  float theta = fract(u_time/4.0) * PI2;
  vec2 p = vec2(cos(theta), sin(theta))*radius;
  float h = clamp( dot(d,p)/dot(p,p), 0.0, 1.0 );
  //float h = dot(d,p)/dot(p,p);
  float l = length(d - p*h);

  float gradient = 0.0;
  const float gradient_angle = 1.0;

  if (length(d)<radius){
    float angle = mod( theta - atan(d.y, d.x), PI2);
    gradient = clamp(gradient_angle - angle, 0.0, gradient_angle) * 0.5;
  }

  return gradient + 1.0 - smoothstep(line_width, line_width+edge_thickness, l);
}

float polygon(vec2 pt, vec2 center, float radius, int sides, float rotate, float edge_thickness){
  pt -= center;
  
  // Angle and radius from the current pixel
  float theta = atan(pt.x, pt.y) + PI + rotate;
  float rad = PI2/float(sides);

  // Shaping function that modulate the distance
  float d = cos(floor(0.5+theta/rad)*rad-theta)*length(pt);

  return 1.0 - smoothstep(radius, radius + edge_thickness, d);
}

void main (void)
{
  vec3 axis_color = vec3(0.8);
  vec3 color = line(vUv.y, 0.5, 0.002) * axis_color;//xAxis
  color += line(vUv.x, 0.5, 0.002) * axis_color;//yAxis
  color += circle(vUv, vec2(0.5), 0.3, 0.002, 0.001) * axis_color;
  color += circle(vUv, vec2(0.5), 0.2, 0.002, 0.001) * axis_color;
  color += circle(vUv, vec2(0.5), 0.1, 0.002, 0.001) * axis_color;
  color += sweep(vUv, vec2(0.5), 0.3, 0.003, 0.001) * vec3(0.1, 0.3, 1.0);
  color += polygon(vUv, vec2(0.9 - sin(u_time*3.0)*0.05, 0.5), 0.005, 3, -PI/6.0, 0.001) * vec3(1.0);
  color += polygon(vUv, vec2(0.1 - sin(u_time*3.0+PI)*0.05, 0.5), 0.005, 3, PI/6.0, 0.001) * vec3(1.0); 
  color += polygon(vUv, vec2(0.5, 0.9 - sin(u_time*3.0)*0.05), 0.005, 3, PI, 0.001) * vec3(1.0);
  color += polygon(vUv, vec2(0.5, 0.1 - sin(u_time*3.0+PI)*0.05), 0.005, 3, 0.0, 0.001) * vec3(1.0); 
  gl_FragColor = vec4(color, 1.0); 
}
`
const fshader_polygon_cirle = `
#define PI 3.141592653589
#define PI2 6.28318530718

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;

varying vec2 vUv;

float circle(vec2 pt, vec2 center, float radius, float line_width, float edge_thickness){
  pt -= center;
  float len = length(pt);
  //Change true to false to soften the edge
  float result = smoothstep(radius-line_width/2.0-edge_thickness, radius-line_width/2.0, len) - smoothstep(radius + line_width/2.0, radius + line_width/2.0 + edge_thickness/2.0, len);

  return result;
}

float polygon(vec2 pt, vec2 center, float radius, int sides, float rotate, float edge_thickness){
  pt -= center;
  
  // Angle and radius from the current pixel
  float theta = atan(pt.y, pt.x) + rotate;
  float rad = PI2/float(sides);

  // Shaping function that modulate the distance
  float d = cos(floor(theta/rad + 0.5)*rad-theta)*length(pt);

  return 1.0 - smoothstep(radius, radius + edge_thickness, d);
}

void main (void)
{
  vec2 pt = gl_FragCoord.xy;
  vec2 center = u_resolution/2.0;
  float radius = 80.0;
  vec3 color = polygon(pt, center, radius, 3, 0.0, 1.0) * vec3(1.0);
  // color += circle(pt, center, radius, 1.0, 1.0)*vec3(0.5);
  color += circle(pt, center, radius, 10.0, 5.0) * vec3(1.0);
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


const shaderScene = new ShaderScene(vshader, fshader_polygon_cirle, uniforms);