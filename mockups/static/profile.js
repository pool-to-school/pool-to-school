let role = {};
let schedule = {};

$(document).ready(()=>{

	// ROLE
	{
		// setup fields and menu
		role.fields = {
			driver: {
				radio: $(".role .static .driver input"),
				button: $(".role .dynamic .driver .button")
			},
			passenger: {
				radio: $(".role .static .passenger  input"),
				button: $(".role .dynamic  .passenger .button")
			}
		};

		role.value = ""; // TODO: populate in meteor

		let switchRole = function(obj, to) {
			return function() {
				for (let field in obj.fields) {
					if (field == to) {
						obj.fields[field].radio.prop("checked", true);
						obj.fields[field].button.removeClass("basic");
					}
					else {
						obj.fields[field].radio.prop("checked", false);
						obj.fields[field].button.addClass("basic");
					}
				}
				obj.value = to;
			};
		};

		if (!!role.fields[role.value]) {
			switchRole(role, role.value);
		}
		// connect menu to radio
		for (let field in role.fields) {
			// console.log(`role.fields[${field}]`);
			role.fields[field].button.on("click", switchRole(role, field));
		}
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
			let dropdowns = [
				field.arrive.find(".dropdown"),
				field.depart.find(".dropdown"),
			];


			let valueToggle = function() {
				value.has = !value.has;
				field.checkbox.prop("checked", value.has);

				let action;
				if (value.has) {
					action = "removeClass";
					for (dropdown of dropdowns) {
						dropdown.dropdown("set text", "Select latest arrival time");
					}
				} 
				else {
					action = "addClass";
					for (dropdown of dropdowns) {
						dropdown.dropdown("clear", null);
					}
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

			for (let dropdown of ["arrive", "depart"]) {
				field[dropdown].on("change", valueUpdate(dropdown));
				if (value[dropdown] == "") {
					field[dropdown].addClass("disabled");
				}
			}
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
