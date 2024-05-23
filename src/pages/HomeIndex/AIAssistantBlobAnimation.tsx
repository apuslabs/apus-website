import { useEffect } from "react";

export const AIAssistantBlobAnimation = () => {
  useEffect(() => {
    $(document).ready(function () {
      let $canvas = $<HTMLCanvasElement>("#blob canvas"), canvas = $canvas[0], renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        context: canvas.getContext("webgl2"),
        antialias: true,
        alpha: true,
      }), simplex = new SimplexNoise();

      renderer.setSize(1600,1200);
      renderer.setPixelRatio(window.devicePixelRatio || 1);

      let scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(
        45,
        ($canvas.width() ?? 0) / ($canvas.height() ?? 0),
        0.1,
        1000
      );

      camera.position.z = 5;

      let geometry = new THREE.SphereGeometry(0.8, 128, 128);

      let material = new THREE.MeshPhongMaterial({
        color: 15002874,
        shininess: 100,
      });

      let lightTop = new THREE.DirectionalLight(16777215, 0.7);
      lightTop.position.set(0, 500, 200);
      lightTop.castShadow = true;
      scene.add(lightTop);

      let lightBottom = new THREE.DirectionalLight(16777215, 0.25);
      lightBottom.position.set(0, -500, 400);
      lightBottom.castShadow = true;
      scene.add(lightBottom);

      let ambientLight = new THREE.AmbientLight(7963286);
      scene.add(ambientLight);

      let sphere = new THREE.Mesh(geometry, material);

      scene.add(sphere);

      let update = () => {
        let time = performance.now() * 0.00001 * 12 * Math.pow(1.82, 3), spikes = 1.6 * 1.82;

        for (let i = 0; i < sphere.geometry.vertices.length; i++) {
          let p = sphere.geometry.vertices[i];
          p.normalize().multiplyScalar(
            1 +
            0.3 *
            simplex.noise3D(p.x * spikes, p.y * spikes, p.z * spikes + time)
          );
        }

        sphere.geometry.computeVertexNormals();
        sphere.geometry.normalsNeedUpdate = true;
        sphere.geometry.verticesNeedUpdate = true;
      };

      function animate() {
        update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
    });
  }, []);
  return (
    <div className="absolute left-0 right-0 bottom-0 w-full h-full">
      <div id="blob" className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[60%] blur-[1px]">
        <canvas></canvas>
      </div>
      <div className="w-[140vw] h-[47vh] md:w-[64vw] md:h-[70vh] absolute -left-[20vw] md:left-[17vw] -bottom-[10vh] md:-bottom-[35vh]" style={{
        background: "linear-gradient(to bottom, #00C2FF 0%, #FF29C3 100%)",
        filter: "blur(200px)",
        borderRadius: '50%'
      }}></div>
      <div className="w-[66vw] md:w-[40vw] h-[32vh] md:h-[40vw] absolute left-[17vw] md:left-[30vw] -bottom-[16vh] md:-bottom-[32vw]" style={{
        background: "linear-gradient(to bottom, #184BFF 0%, #174AFF 100%)",
        filter: "blur(200px)",
        opacity: 0.8,
      }}></div>
      <div className="w-40 h-40 absolute -top-32 left-1/2 -translate-x-1/2 bg-white blur-[400px] rounded-full"></div>
    </div>
  );
};
