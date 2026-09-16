(function () {
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.body.classList.add('no-scroll');

window.addEventListener('load', function () {
var splash = document.getElementById('splashScreen');
if (!splash) return;
setTimeout(function () {
splash.classList.add('is-hidden');
document.body.classList.remove('no-scroll');
setTimeout(function () {
splash.remove();
}, 650);
}, 500);
});

function setViewportHeight() {
var vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', vh + 'px');
}
setViewportHeight();
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

var header = document.getElementById('siteHeader');

function updateHeaderHeight() {
if (!header) return;
document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
}
updateHeaderHeight();
window.addEventListener('resize', updateHeaderHeight);
window.addEventListener('load', updateHeaderHeight);

window.addEventListener('scroll', function () {
if (!header) return;
if (window.scrollY > 24) {
header.classList.add('is-scrolled');
} else {
header.classList.remove('is-scrolled');
}
}, { passive: true });

var navToggle = document.getElementById('navToggle');
var navMobile = document.getElementById('navMobile');
var navOverlay = document.getElementById('navOverlay');

function closeMobileNav() {
if (!navMobile || !navToggle) return;
navMobile.classList.remove('is-open');
navToggle.classList.remove('is-open');
navToggle.setAttribute('aria-expanded', 'false');
if (navOverlay) navOverlay.classList.remove('is-open');
}

function openMobileNav() {
if (!navMobile || !navToggle) return;
navMobile.classList.add('is-open');
navToggle.classList.add('is-open');
navToggle.setAttribute('aria-expanded', 'true');
if (navOverlay) navOverlay.classList.add('is-open');
}

if (navToggle && navMobile) {
navToggle.addEventListener('click', function () {
if (navMobile.classList.contains('is-open')) {
closeMobileNav();
} else {
openMobileNav();
}
});

document.addEventListener('click', function (e) {
if (!navMobile.contains(e.target) && !navToggle.contains(e.target)) {
closeMobileNav();
}
});

document.addEventListener('keydown', function (e) {
if (e.key === 'Escape') {
closeMobileNav();
}
});

var mobileLinks = navMobile.querySelectorAll('.nav-link');
for (var i = 0; i < mobileLinks.length; i++) {
mobileLinks[i].addEventListener('click', closeMobileNav);
}
}

var navList = document.getElementById('navList');
var navMarker = document.getElementById('navMarker');
var deskLinks = navList ? navList.querySelectorAll('.nav-link') : [];

function moveMarkerTo(link) {
if (!link || !navMarker || !navList) return;
var linkRect = link.getBoundingClientRect();
var listRect = navList.getBoundingClientRect();
var center = (linkRect.left - listRect.left) + (linkRect.width / 2) - 3.5;
navMarker.style.transform = 'rotate(45deg) translateX(' + (-center) + 'px)';
}

function getActiveDeskLink() {
for (var j = 0; j < deskLinks.length; j++) {
if (deskLinks[j].classList.contains('is-active')) return deskLinks[j];
}
return deskLinks[0];
}

if (navList && deskLinks.length) {
for (var k = 0; k < deskLinks.length; k++) {
deskLinks[k].addEventListener('mouseenter', function (e) {
moveMarkerTo(e.currentTarget);
});
}
navList.addEventListener('mouseleave', function () {
moveMarkerTo(getActiveDeskLink());
});
window.addEventListener('resize', function () {
moveMarkerTo(getActiveDeskLink());
});
window.addEventListener('load', function () {
moveMarkerTo(getActiveDeskLink());
});
setTimeout(function () {
moveMarkerTo(getActiveDeskLink());
}, 250);
}

var navLinks = document.querySelectorAll('.nav-link');
var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));

function setActiveLink(id) {
navLinks.forEach(function (link) {
if (link.getAttribute('data-target') === id) {
link.classList.add('is-active');
} else {
link.classList.remove('is-active');
}
});
moveMarkerTo(getActiveDeskLink());
}

function getCurrentSection() {
if (!sections.length) return null;
var headerH = header ? header.offsetHeight : 0;
var scrollPos = window.scrollY + headerH + 60;
var current = sections[0];
for (var s = 0; s < sections.length; s++) {
if (sections[s].offsetTop <= scrollPos) {
current = sections[s];
} else {
break;
}
}
return current;
}

var activeTicking = false;

function onScrollActive() {
if (activeTicking) return;
activeTicking = true;
window.requestAnimationFrame(function () {
var current = getCurrentSection();
if (current) setActiveLink(current.id);
activeTicking = false;
});
}

if (sections.length) {
window.addEventListener('scroll', onScrollActive, { passive: true });
window.addEventListener('resize', onScrollActive);
window.addEventListener('load', onScrollActive);
onScrollActive();
}

var revealEls = document.querySelectorAll('.reveal-io');

if ('IntersectionObserver' in window && revealEls.length) {
var revealObserver = new IntersectionObserver(function (entries) {
entries.forEach(function (entry) {
if (entry.isIntersecting) {
entry.target.classList.add('is-in');
revealObserver.unobserve(entry.target);
}
});
}, { threshold: 0.15 });

revealEls.forEach(function (el) {
revealObserver.observe(el);
});
} else {
revealEls.forEach(function (el) {
el.classList.add('is-in');
});
}

var counters = document.querySelectorAll('.count');

function animateCounter(el) {
var target = parseInt(el.getAttribute('data-target'), 10) || 0;
var prefix = el.getAttribute('data-prefix') || '';
var duration = 1700;
var start = null;

function step(timestamp) {
if (!start) start = timestamp;
var progress = Math.min((timestamp - start) / duration, 1);
var eased = 1 - Math.pow(1 - progress, 3);
var value = Math.floor(eased * target);
el.textContent = prefix + value;
if (progress < 1) {
requestAnimationFrame(step);
} else {
el.textContent = prefix + target;
}
}

if (reduceMotion) {
el.textContent = prefix + target;
} else {
requestAnimationFrame(step);
}
}

if ('IntersectionObserver' in window && counters.length) {
var counterObserver = new IntersectionObserver(function (entries) {
entries.forEach(function (entry) {
if (entry.isIntersecting) {
animateCounter(entry.target);
counterObserver.unobserve(entry.target);
}
});
}, { threshold: 0.4 });

counters.forEach(function (counter) {
counterObserver.observe(counter);
});
} else {
counters.forEach(function (counter) {
animateCounter(counter);
});
}

var faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(function (item) {
var question = item.querySelector('.faq-question');
var answer = item.querySelector('.faq-answer');
if (!question || !answer) return;

question.addEventListener('click', function () {
var isOpen = item.classList.contains('is-open');

faqItems.forEach(function (other) {
other.classList.remove('is-open');
var otherQuestion = other.querySelector('.faq-question');
var otherAnswer = other.querySelector('.faq-answer');
if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
if (otherAnswer) otherAnswer.style.maxHeight = null;
});

if (!isOpen) {
item.classList.add('is-open');
question.setAttribute('aria-expanded', 'true');
answer.style.maxHeight = answer.scrollHeight + 'px';
}
});
});

var serviceForm = document.getElementById('serviceForm');

if (serviceForm) {
serviceForm.addEventListener('submit', function (e) {
e.preventDefault();

var nameField = document.getElementById('fName');
var phoneField = document.getElementById('fPhone');
var serviceField = document.getElementById('fService');
var messageField = document.getElementById('fMessage');

var name = nameField ? nameField.value.trim() : '';
var phone = phoneField ? phoneField.value.trim() : '';
var service = serviceField ? serviceField.value : '';
var message = messageField ? messageField.value.trim() : '';

var text = 'طلب خدمة جديد من موقع غيث للمقاولات' + '\n\n';
text += 'الاسم: ' + name + '\n';
text += 'رقم الجوال: ' + phone + '\n';
text += 'الخدمة المطلوبة: ' + service + '\n';
if (message) {
text += 'تفاصيل إضافية: ' + message + '\n';
}

var url = 'https://wa.me/966536829032?text=' + encodeURIComponent(text);
window.open(url, '_blank');
});
}
})();