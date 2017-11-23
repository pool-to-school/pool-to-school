let items;
$(document).ready(()=>{
	items = $(".browse.items");
	items.children().each(function(i) {
		let item = $(this);
		let interests = item.find(".interests");

		console.log(item);
		console.log(interests);

		item.find(".interest.button").on('click', ()=>{
			interests.transition({
				animation: "fade down",
			});
			console.log("clicked "+i.toString());
		});
	});
});