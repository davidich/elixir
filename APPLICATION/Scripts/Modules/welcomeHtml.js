define([], function () {
    var welcomeHtmlBuilder = {
        build: function (onComplete) {
            var sliderImagesPath = "Images/events/sliderImages/";

            global.welcomeData = [
                { 'imageUrl': sliderImagesPath  + 'rihanna.png' },
                { 'imageUrl': sliderImagesPath + 'novarock.png' },
                { 'imageUrl': sliderImagesPath + 'sensation.png' }
            ];
            
            onComplete();
        }
    };

    return welcomeHtmlBuilder;
});