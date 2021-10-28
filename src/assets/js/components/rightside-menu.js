/* Логика для rightside-menu */
const headerBtn = $('#header__btn');
const rightsideMenu = $("#rightside-menu");
const rightsideMenuBtn = $("#rightside-menu__close");

headerBtn.on("click", function() {
    rightsideMenu.removeClass("rightside-menu--closed")
});

rightsideMenuBtn.on("click", function() {
    rightsideMenu.addClass("rightside-menu--closed")
});