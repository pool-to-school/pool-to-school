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

		let switchRole = function(role, from, to) {
			if (role.value == from) {
				role.field[role.value].prop("checked", false);
				role.menu[role.value].removeClass("active");
			}
			role.value = to;
			role.field[role.value].prop("checked", true);
			role.menu[role.value].addClass("active");
		}
		// connect menu to radio
		role.menu.driver.on('click', function() {
			switchRole(role, "passenger", "driver");
		});
		role.menu.passenger.on('click', function() {
			switchRole(role, "driver", "passenger");
		});
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
				leave: ""
			};
			schedule.fields[day] = {
				checkbox: $(`.schedule .${day}.day.fields .has.field input`),
				button: $(`.schedule .${day}.day.fields .has.field .button`),
				arrive: $(`.schedule .${day}.day.fields .arrive.field`),
				leave: $(`.schedule .${day}.day.fields .leave.field`)
			}
			
			// field functionality
			let value = schedule.values[day];
			let field = schedule.fields[day];

			if (value.arrive == "") {
				field.arrive.addClass("disabled");
			}
			if (value.leave == "") {
				field.leave.addClass("disabled");
			}

			field.button.on('click', function() {
				value.has = !value.has;
				if (value.has) {
					field.checkbox.prop("checked", true);
					field.button.removeClass("basic");
					field.arrive.removeClass("disabled");
					field.leave.removeClass("disabled");
				}
				else {
					field.checkbox.prop("checked", false);
					field.button.addClass("basic");
					field.arrive.addClass("disabled");
					field.leave.addClass("disabled");

					field.arrive.find('.dropdown').dropdown('clear');
					field.leave.find('.dropdown').dropdown('clear');
				}
			});

			field.arrive.on('change', function(event) {
				value.arrive = event.target.value;
				console.log(value.arrive);
			});
			field.leave.on('change', function(event) {
				value.leave = event.target.value;
				console.log(value.leave);
			});
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

		button.interest.on('click', ()=>{
			
			if (button.interest.hasClass('active'))
				button.interest.removeClass('active');
			else
				button.interest.addClass('active');

			interests.transition({
				animation: "fade down",
			});
		});
		button.schedule.on('click', ()=>{
			if (button.schedule.hasClass('active'))
				button.schedule.removeClass('active');
			else
				button.schedule.addClass('active');

			schedule.transition({
				animation: "fade down",
			});
		});
		button.location.on('click', ()=>{
			if (button.location.hasClass('active'))
				button.location.removeClass('active');
			else
				button.location.addClass('active');

			location.transition({
				animation: "fade down",
			});
		});
	});

	menu = $(".category.menu");
	menu.children().each(function() {
		let item = $(this);
		console.log(this);
		item.on('click', () => {
			menu.children().removeClass('active');
			item.addClass('active');
		});
	});
*/

	// console.log(menu);
});
