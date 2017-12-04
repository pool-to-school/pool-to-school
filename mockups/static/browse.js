let items;
$(document).ready(()=>{
	items = $(".browse.items");
	items.children().each(function() {
		let item = $(this);
		let details = {
			interest: item.find(".interest.details"),
			schedule: item.find(".schedule.details"),
			location: item.find(".location.details"),
		};
		let button = {
			interest: item.find(".interest.button"),
			schedule: item.find(".schedule.button"),
			location: item.find(".location.button"),
		};

		let detailsToggle = function(field) {
			return function() {
				if (button[field].hasClass('active')) {
					button[field].removeClass('active');
				}
				else {
					button[field].addClass('active');
				}

				details[field].transition({
					animation: "fade down",
				});
			}
		}

		for (field in details) {
			button[field].on('click', detailsToggle(field));
		}
	});

	menu = $(".category.menu");
	menu.children().each(function() {
		let item = $(this);
		item.on('click', function() {
			menu.children().removeClass('active');
			item.addClass('active');
		});
	});

	// console.log(menu);
});
