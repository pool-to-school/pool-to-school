let role = {};
let schedule = {};

$(document).ready(()=>{
	// activate prettier fields
	$(".static").hide();
	$(".dynamic").show();

	// ROLE
	{
		// setup fields and menu
		role.field = {
			group: $(".role.fields"),
			driver: $(".role.fields .driver.field input"),
			passenger: $(".role.fields .passenger.field input")
		};
		role.menu = {
			group: $(".role.menu"),
			driver: $(".role.menu .driver.item"),
			passenger: $(".role.menu .passenger.item")
		};
		role.value = ""; // TODO: populate in meteor
		if (!!role.field[role.value]) {
			role.menu[role.value].addClass("active");
			role.field[role.value].prop("checked", true);
		}

		let switchRole = function(obj, from, to) {
			return function() {
				if (obj.value == from) {
					obj.field[obj.value].prop("checked", false);
					obj.menu[obj.value].removeClass("active");
				}
				obj.value = to;
				obj.field[obj.value].prop("checked", true);
				obj.menu[obj.value].addClass("active");
			};
		};
		// connect menu to radio
		role.menu.driver.on("click", switchRole(role, "passenger", "driver"));
		role.menu.passenger.on("click", switchRole(role, "driver", "passenger"));
	}

	// SCHEDULE 
	{
		schedule.values = {};
		schedule.fields = {};
		let days = ["sun", "mon", "tues", "wednes", "thurs", "fri", "satur"];
		for (let day of days) {
			// TODO: populate using meteor
			schedule.values[day] = {
				has: false,
				arrive: "",
				depart: ""
			};
			schedule.fields[day] = {
				checkbox: $(`.schedule .${day}.day.fields .has.field input`),
				button: $(`.schedule .${day}.day.fields .has.field .button`),
				arrive: $(`.schedule .${day}.day.fields .arrive.field`),
				depart: $(`.schedule .${day}.day.fields .depart.field`)
			}
			
			// field functionality
			let value = schedule.values[day];
			let field = schedule.fields[day];

			if (value.arrive == "") {
				field.arrive.addClass("disabled");
			}
			if (value.depart == "") {
				field.depart.addClass("disabled");
			}

			let valueToggle = function() {
				value.has = !value.has;
				field.checkbox.prop("checked", value.has);

				let action;
				if (value.has) {
					action = "removeClass";
					field.arrive.find(".dropdown").dropdown("set text", "Select latest arrival time");
					field.depart.find(".dropdown").dropdown("set text", "Select earliest departure time");
				} else {
					action = "addClass";
					field.arrive.find(".dropdown").dropdown("clear", null);
					field.depart.find(".dropdown").dropdown("clear", null);
				}

				field.button[action]("basic");
				field.arrive[action]("disabled");
				field.depart[action]("disabled");
			};

			let valueUpdate = function(what) {
				return function(event) {
					value[what] = event.target.value;
					console.log(value[what]);
				};
			};

			field.button.on("click", valueToggle);

			field.arrive.on("change", valueUpdate("arrive"));
			field.depart.on("change", valueUpdate("leave"));
		}
	}

	// SUBMIT 
	{
		
	}

/*
	items.children().each(function() {
		let item = $(this);
		let interests = item.find(".interest.details");
		let interests_labels = interests.children();
		let schedule = item.find(".schedule.details");
		let location = item.find(".location.details");
		let button = {
			interest: item.find(".interest.button"),
			schedule: item.find(".schedule.button"),
			location: item.find(".location.button")
		};

		// interests.hide();
		// schedule.hide();
		// location.hide();

		// console.log(item);
		// console.log(interests);
		// console.log(schedule);
		// console.log(location);

		button.interest.on("click", ()=>{
			
			if (button.interest.hasClass("active"))
				button.interest.removeClass("active");
			else
				button.interest.addClass("active");

			interests.transition({
				animation: "fade down",
			});
		});
		button.schedule.on("click", ()=>{
			if (button.schedule.hasClass("active"))
				button.schedule.removeClass("active");
			else
				button.schedule.addClass("active");

			schedule.transition({
				animation: "fade down",
			});
		});
		button.location.on("click", ()=>{
			if (button.location.hasClass("active"))
				button.location.removeClass("active");
			else
				button.location.addClass("active");

			location.transition({
				animation: "fade down",
			});
		});
	});

	menu = $(".category.menu");
	menu.children().each(function() {
		let item = $(this);
		console.log(this);
		item.on("click", () => {
			menu.children().removeClass("active");
			item.addClass("active");
		});
	});
*/

	// console.log(menu);
});
