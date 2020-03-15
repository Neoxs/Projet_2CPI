

var xa;
xa = 'lab1';
xc = 'lab3'
function zozo (x) {
document.querySelector('.' + x).classList.add('active');
console.log(x)
}
document.querySelector('.lab1').addEventListener('focus', zozo (xa));
document.querySelector('.lab3').addEventListener('focus', zozo (xc));
document.querySelector('.form-control').addEventListener('focus', function (){
document.querySelector('.byad').style.display = 'none';
});