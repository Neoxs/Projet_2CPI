var xa;
xa = 'lab1';
xb = 'lab2'
xc = 'lab3'
xd = 'lab4'
function zozo (x) {
document.querySelector('.' + x).classList.toggle('active');
console.log(x)
}
document.querySelector('.lab1').addEventListener('click', zozo (xa));
document.querySelector('.lab2').addEventListener('click', zozo (xb));
document.querySelector('.lab3').addEventListener('click', zozo (xc));
document.querySelector('.lab3').addEventListener('click', zozo (xd));
document.querySelector('.form-control').addEventListener('focus', function (){
document.querySelector('.byad').style.display = 'none';
});