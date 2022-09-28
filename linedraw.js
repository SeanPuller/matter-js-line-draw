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

//Colors
var colorBackground = '#14151f';
var colorColliders = '#eeda94';
var colorBalls = '#003cff';
var colorConstraints = '#ffffff';
var colorInteractable = '#F5D259';

var previousMouse = {x:0,y:0};
var currentMouse = {x:0,y:0};
var mousedownIsDown = false;
var isFirstLoop = false;


// create an engine
var engine = Engine.create();
world = engine.world;
engine.enableSleeping = true;

var width = window.innerWidth - 20;
var height = window.innerHeight - 20;

var pullstringLocation = { x: width - 20, y: 20 };


// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
	options: {
		width: width,
		height: height,
		wireframes: false,
		background: colorBackground,
		showSleeping: false
	  }
});

//Mouse
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

//OnMouseDown
Events.on(mouseConstraint, "mousedown", function () {
	mousedownIsDown = true;
	isFirstLoop = true;
});

//OnMouseUp
Events.on(mouseConstraint, "mouseup", function () {
	mousedownIsDown = false;
});

var intval = 0;

// Update
Events.on(engine, 'afterUpdate', function () {
	if (Vector.magnitude(Vector.sub(body.position, { x: width - 100, y: 50 })) > 100) {
		if(intval <= 300){
			var circleB = Bodies.circle(width/2 + Common.random(10, 20), 100 + Common.random(10, 20), 10 /*, { render: { fillStyle: colorBalls} }*/);
			Composite.add(world, [circleB]);
			intval++;
		}
	}
});

//OnMove
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
		if (mousedistance< 15) {
			return;
		}

		var pos = Vector.add(Vector.mult(Vector.sub(currentMouse,previousMouse), 0.5), previousMouse);

		var line = Bodies.rectangle(pos.x, pos.y, mousedistance, 5, { render: { fillStyle: colorColliders} });	
		Matter.Body.setStatic(line, true);
		Matter.Body.rotate(line, Vector.angle(currentMouse, previousMouse));

		Composite.add(world, [line]);		

		previousMouse = currentMouse;
	}
});

//Colliders
var wall1 = Bodies.rectangle(-40, height/2, 80, height, { render: { fillStyle: colorColliders }, isStatic: true });
var wall2 = Bodies.rectangle(width + 40, height/2, 80, height,{ render: { fillStyle: colorColliders }, isStatic: true });
var ground = Bodies.rectangle(width/2, height, width, 60,{ render: { fillStyle: colorColliders }, isStatic: true });
Composite.add(world, [ground, wall1, wall2]);

//Add Pullstring
var body = Bodies.polygon(pullstringLocation.x, pullstringLocation.y, 3, 30, { render: { fillStyle: colorInteractable} });

var constraint = Constraint.create({
	pointA: pullstringLocation,
	bodyB: body,
	pointB: {x: 0, y: 0 },
	stiffness: 0.001,
	render: {strokeStyle: colorConstraints}
});
Composite.add(world, [body, constraint]);

Render.run(render);
// create runner
var runner = Runner.create();
// run the engine
Runner.run(runner, engine);
