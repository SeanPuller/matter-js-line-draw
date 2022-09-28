// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
	Events = Matter.Events,
    Composite = Matter.Composite,
	Common = Matter.Common,
	MouseConstraint = Matter.MouseConstraint,
	Mouse = Matter.Mouse,
	Constraint = Matter.Constraint,
	Vector = Matter.Vector;

// create an engine
var engine = Engine.create();
world = engine.world;
engine.enableSleeping = true;

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
	options: {
		width: window.innerWidth,
		height: window.innerHeight,
		wireframes: false
	  }
});

var mouse = Mouse.create(render.canvas);

var mouse = Mouse.create(render.canvas),
mouseConstraint = MouseConstraint.create(engine, {
	mouse: mouse,
	constraint: {
		stiffness: 0.2,
		render: {
			visible: false
		}
	}
});

Composite.add(world, mouseConstraint);

var previousMouse = {x:0,y:0};
var currentMouse = {x:0,y:0};
var mousedownIsDown = false;
var isFirstLoop = false;

Events.on(mouseConstraint, "mousedown", function () {
	mousedownIsDown = true;
	isFirstLoop = true;
});

Events.on(mouseConstraint, "mouseup", function () {
	mousedownIsDown = false;
});

var intval = 0;

Events.on(engine, 'afterUpdate', function () {
	if (Vector.magnitude(Vector.sub(body.position, { x: 280, y: 120 })) > 150) {
		if(intval <= 300){
			var circleB = Bodies.circle(window.innerWidth/2 + Common.random(10, 20), 100 + Common.random(10, 20), 20);
			Composite.add(world, [circleB]);
			intval++;
		}
	}
});

Events.on(mouseConstraint, "mousemove", function () {
	if (mousedownIsDown) {
		if(mouseConstraint.body != null){
			return;
		}
		if (isFirstLoop) {
			previousMouse = {x:mouse.position.x,y:mouse.position.y};
			isFirstLoop = false;
			return;
		}
		currentMouse = {x:mouse.position.x,y:mouse.position.y};

		var mousedistance = Vector.magnitude(Vector.sub(currentMouse, previousMouse));
		if (mousedistance< 20) {
			return;
		}

		var pos = Vector.add(Vector.mult(Vector.sub(currentMouse,previousMouse), 0.5), previousMouse);

		var line = Bodies.rectangle(pos.x, pos.y, mousedistance, 5, { render: { fillStyle: '#FDFF5C'} });	
		Matter.Body.setStatic(line, true);
		Matter.Body.rotate(line, Vector.angle(currentMouse, previousMouse));

		Composite.add(world, [line]);		

		previousMouse = currentMouse;
	}
});

var ground = Bodies.rectangle(render.canvas.width/2, render.canvas.height - (render.canvas.height/5), render.canvas.width, 60,{ render: { fillStyle: '#000000' }, isStatic: true }, );

Composite.add(world, [ground]);

// add soft global constraint
var body = Bodies.polygon(280, 100, 3, 30);

var constraint = Constraint.create({
	pointA: { x: 280, y: 120 },
	bodyB: body,
	pointB: { x: -10, y: -7 },
	stiffness: 0.001
});

Composite.add(world, [body, constraint]);

Render.run(render);
// create runner
var runner = Runner.create();
// run the engine
Runner.run(runner, engine);
