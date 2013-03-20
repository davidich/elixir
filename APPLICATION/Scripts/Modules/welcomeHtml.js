define([], function () {
    var welcomeHtmlBuilder = {
        build: function (onComplete) {
            var sliderImagesPath = "Images/events/sliderImages/";

            global.welcomeData = [
                {
                    imageUrl: sliderImagesPath + 'rihanna.png',
                    title: 'Концерт Рианы  в Барселоне',
                    fileName: 'rihanna.html'
                    
                },
                {
                    imageUrl: sliderImagesPath + 'novarock.png',
                    title: 'Феситваль Novarock в Германии',
                    fileName: 'novarock.html'
                },
                {
                    imageUrl: sliderImagesPath + 'sensation.png',
                    title: 'Sensation White в Амстердаме',
                    fileName: 'sensation.html'
                }
            ];
            
            onComplete();
        }
    };

    return welcomeHtmlBuilder;
});