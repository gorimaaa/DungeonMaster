import { useEffect } from "react";
import "./../css/plateau2.css";
import Escrimeur_img from "./../assets/escrimeur.png";
import Archer_img from "./../assets/archer.jpg";
import Map from "./../assets/piece_maison.png";
export default function Plateau2() {
  useEffect(() => {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    let context = canvas.getContext("2d");
    if (!context) return;
    const width_canvas = 600;
    const height_canvas = 600;
    canvas.width = width_canvas;
    canvas.height = height_canvas;

    let map_img = new Image();
    map_img.src = Map;
    let escrimeur_img = new Image();
    escrimeur_img.src = Escrimeur_img;
    let archer_img = new Image();
    archer_img.src = Archer_img;
    map_img.onload = () => {
      var shapes: any = [];
      shapes.push({
        img: escrimeur_img,
        x: 200,
        y: 50,
        width: 100,
        height: 100,
      });
      shapes.push({ img: archer_img, x: 10, y: 10, width: 100, height: 100 });
      let is_dragging = false;
      var current_shape_index: number;
      var startX: number;
      var startY: number;
      let is_mouse_in_shape = function (x: number, y: number, shape: any) {
        let shape_left = shape.x;
        let shape_right = shape.x + shape.width;
        let shape_top = shape.y;
        let shape_bottom = shape.y + shape.height;

        if (
          x > shape_left &&
          x < shape_right &&
          y > shape_top &&
          y < shape_bottom
        ) {
          return true;
        }
        return false;
      };
      var mouse_down = function (event: MouseEvent) {
        event.preventDefault();

        startX = event.clientX;
        startY = event.clientY;

        let index = 0;
        for (let shape of shapes) {
          if (is_mouse_in_shape(startX, startY, shape)) {
            console.log("yes");
            current_shape_index = index;
            is_dragging = true;
            return;
          } else {
            console.log("no");
          }
          index++;
        }
      };

      let mouse_up = function (event: MouseEvent) {
        event.preventDefault();
        if (!is_dragging) {
          return;
        }
        is_dragging = false;
      };

      let mouse_out = function (event: MouseEvent) {
        event.preventDefault();
        if (!is_dragging) {
          return;
        }
        is_dragging = false;
      };

      let mouse_move = function (event: MouseEvent) {
        if (!is_dragging) {
          return;
        } else {
          event.preventDefault();
          let mouseX = event.clientX;
          let mouseY = event.clientY;

          let dx = mouseX - startX;
          let dy = mouseY - startY;

          let current_shape = shapes[current_shape_index];
          current_shape.x += dx;
          current_shape.y += dy;

          draw_shapes();

          startX = mouseX;
          startY = mouseY;
        }
      };

      canvas.onmousedown = mouse_down;
      canvas.onmouseup = mouse_up;
      canvas.onmouseout = mouse_out;
      canvas.onmousemove = mouse_move;
      let draw_shapes = function () {
        context.clearRect(0, 0, width_canvas, height_canvas);
        context.drawImage(map_img, 0, 0, width_canvas, height_canvas);
        for (let shape of shapes) {
          context.drawImage(
            shape.img,
            shape.x,
            shape.y,
            shape.width,
            shape.height
          );
        }
      };
      draw_shapes();
    };
  }, []);
  return (
    <div className="flex">
      {/* Canvas à gauche */}
      <canvas id="canvas"></canvas>

      {/* Liste d'images à droite */}
      <div className="ml-4 flex flex-col gap-2">
        <img src={Escrimeur_img} alt="Image 1" className="w-20 h-20 rounded" />
        <img src={Archer_img} alt="Image 2" className="w-20 h-20 rounded" />
      </div>
    </div>
  );
}
