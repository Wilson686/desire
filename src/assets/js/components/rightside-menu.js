/* Логика для rightside-menu */
const headerBtn = $('#header__btn');
const rightsideMenu = $("#rightside-menu");
const rightsideMenuBtn = $("#rightside-menu__close");

headerBtn.on("click", function() {
    rightsideMenu.removeClass("rightside-menu--closed");
    $('body').addClass("no-scroll");
});

rightsideMenuBtn.on("click", function() {
    rightsideMenu.addClass("rightside-menu--closed");
    $('body').removeClass("no-scroll");
});