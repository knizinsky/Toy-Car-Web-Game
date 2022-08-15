const toyCar = document.querySelector('.toy-car');

function addJump() {
	if (toyCar.classList != 'jump') {
		toyCar.classList.add('jump');

		setTimeout(function () {
			toyCar.classList.remove('jump');
		}, 500);
	}
}
document.addEventListener('keydown', function() {
	addJump();
});
 