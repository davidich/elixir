﻿// this wrapper is used in main.js
// add here anything what is need every time when knockout is passed to AMD
define(["knockout",
        "Libs/knockout/knockout.mapping.debug",
        "Libs/knockout/customBindings/class"        
    ], function (ko, mapping) {
        ko.mapping = mapping;
        return ko;
    })