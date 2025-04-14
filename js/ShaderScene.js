class ShaderScene {
  constructor(vshader, fshader, uniforms) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    this.renderer = new THREE.WebGLRenderer();
    this.clock = new THREE.Clock();

    this.uniforms = uniforms;
    
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vshader,
      fragmentShader: fshader,
      transparent: true

    });

    this.plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    this.scene.add(this.plane);

    this.camera.position.z = 1;

    this.initRenderer();
    this.addEventListeners();
    this.onWindowResize();
    this.animate();
  }

  initRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  addEventListeners() {
    if ('ontouchstart' in window) {
      document.addEventListener('touchmove', this.move.bind(this));
    } else {
      window.addEventListener('resize', this.onWindowResize.bind(this), false);
      document.addEventListener('mousemove', this.move.bind(this));
      document.addEventListener('wheel',this.onMouseWheel.bind(this), false);

    }
  }

  onMouseWheel(event) {
    const zoomFactor = 0.1; // 缩放因子
    const delta = event.deltaY > 0 ? 1 : -1; // 判断滚轮方向
  
    // 调整相机的视图范围
    this.camera.left *= (1 + delta * zoomFactor);
    this.camera.right *= (1 + delta * zoomFactor);
    this.camera.top *= (1 + delta * zoomFactor);
    this.camera.bottom *= (1 + delta * zoomFactor);
  
    // 更新相机的投影矩阵
    this.camera.updateProjectionMatrix();
  }
  
  move(evt) {
    this.uniforms.u_mouse.value.x = evt.touches ? evt.touches[0].clientX : evt.clientX;
    this.uniforms.u_mouse.value.y = evt.touches ? evt.touches[0].clientY : evt.clientY;
  }

  onWindowResize() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    let width, height;
    if (aspectRatio >= 1) {
      width = 1;
      height = (window.innerHeight / window.innerWidth) * width;
    } else {
      width = aspectRatio;
      height = 1;
    }
    this.camera.left = -width;
    this.camera.right = width;
    this.camera.top = height;
    this.camera.bottom = -height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.uniforms.u_resolution.value.x = window.innerWidth;
    this.uniforms.u_resolution.value.y = window.innerHeight;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.uniforms.u_time.value += this.clock.getDelta();
    this.renderer.render(this.scene, this.camera);
  }
}