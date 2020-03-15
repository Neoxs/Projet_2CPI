

var xa;
xa = 'lab1';
xb = 'lab2'
xc = 'lab3'
xd = 'lab4'
xx = 'lab5'
function zozo (x) {
document.querySelector('.' + x).classList.add('active');
console.log(x)
}
document.querySelector('.lab1').addEventListener('focus', zozo (xa));
document.querySelector('.lab2').addEventListener('focus', zozo (xb));
document.querySelector('.lab3').addEventListener('focus', zozo (xc));
document.querySelector('.lab4').addEventListener('focus', zozo (xd));
document.querySelector('.lab5').addEventListener('focus', zozo (xx));
document.querySelector('.form-control').addEventListener('focus', function (){
document.querySelector('.byad').style.display = 'none';
});