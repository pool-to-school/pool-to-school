let items;
$(document).ready(()=>{
	items = $(".browse.items");
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

	console.log(menu);
});
