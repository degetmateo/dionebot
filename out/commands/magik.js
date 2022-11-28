"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const jimp_1 = __importDefault(require("jimp"));
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("magik")
        .setDescription("Deforma el avatar de un usuario.")
        .addUserOption(option => option
        .setName("usuario")
        .setDescription("El usuario del que se quiere deformar el avatar.")),
    execute: async (interaction) => {
        const usuario = interaction.options.getUser("usuario") == null ?
            interaction.user :
            interaction.options.getUser("usuario");
        if (!usuario) {
            console.error("ERROR - magik - No se ha encontrado al usuario.");
            return interaction.reply({
                content: "Ha ocurrido un error.",
                ephemeral: true
            });
        }
        const avatarURL = usuario.avatarURL();
        if (!avatarURL) {
            console.error("ERROR - magik - No se ha encontrado la URL del avatar del usuario.");
            return interaction.reply({
                content: "No se ha encontrado la URL del avatar del usuario.",
                ephemeral: true
            });
        }
        interaction.deferReply();
        try {
            const image = await jimp_1.default.read(avatarURL);
            console.log(image.toString());
            image.posterize(3); // apply a posterization effect with n level
            image.sepia(); // apply a sepia wash to the image
            image.pixelate(3); // apply a pixelation effect to the image or a region
            const embed = new discord_js_1.EmbedBuilder()
                .setImage(image.toString());
            return interaction.editReply({
                embeds: [embed]
            });
        }
        catch (err) {
            console.error(err);
            interaction.editReply({
                content: "Ha ocurrido un error."
            });
        }
    }
};
/*
Resize
image.contain( w, h[, alignBits || mode, mode] );    // scale the image to the given width and height, some parts of the image may be letter boxed
image.cover( w, h[, alignBits || mode, mode] );      // scale the image to the given width and height, some parts of the image may be clipped
image.resize( w, h[, mode] );     // resize the image. Jimp.AUTO can be passed as one of the values.
image.scale( f[, mode] );         // scale the image by the factor f
image.scaleToFit( w, h[, mode] ); // scale the image to the largest size that fits inside the given width and height

// An optional resize mode can be passed with all resize methods.

Crop
image.autocrop([tolerance, frames]); // automatically crop same-color borders from image (if any), frames must be a Boolean
image.autocrop(options);          // automatically crop same-color borders from image (if any), options may contain tolerance, cropOnlyFrames, cropSymmetric, leaveBorder
image.crop( x, y, w, h );         // crop to the given region

Composing
image.blit( src, x, y, [srcx, srcy, srcw, srch] );
                                  // blit the image with another Jimp image at x, y, optionally cropped.
image.composite( src, x, y, [{ mode, opacitySource, opacityDest }] );     // composites another Jimp image over this image at x, y
image.mask( src, x, y );          // masks the image with another Jimp image at x, y using average pixel value
image.convolute( kernel );        // applies a convolution kernel matrix to the image or a region

Flip and rotate
image.flip( horz, vert );         // flip the image horizontally or vertically
image.mirror( horz, vert );       // an alias for flip
image.rotate( deg[, mode] );      // rotate the image clockwise by a number of degrees. Optionally, a resize mode can be passed. If `false` is passed as the second parameter, the image width and height will not be resized.

Colour
image.brightness( val );          // adjust the brighness by a value -1 to +1
image.contrast( val );            // adjust the contrast by a value -1 to +1
image.dither565();                // ordered dithering of the image and reduce color space to 16-bits (RGB565)
image.greyscale();                // remove colour from the image
image.invert();                   // invert the image colours
image.normalize();                // normalize the channels in an image

Alpha channel
image.hasAlpha();                     // determines if an image contains opaque pixels
image.fade( f );                  // an alternative to opacity, fades the image by a factor 0 - 1. 0 will haven no effect. 1 will turn the image
image.opacity( f );               // multiply the alpha channel by each pixel by the factor f, 0 - 1
image.opaque();                   // set the alpha channel on every pixel to fully opaque
image.background( hex );          // set the default new pixel colour (e.g. 0xFFFFFFFF or 0x00000000) for by some operations (e.g. image.contain and

Blurs
image.gaussian( r );              // Gaussian blur the image by r pixels (VERY slow)
image.blur( r );                  // fast blur the image by r pixels

Effects
image.posterize( n );             // apply a posterization effect with n level
image.sepia();                    // apply a sepia wash to the image
image.pixelate( size[, x, y, w, h ]);  // apply a pixelation effect to the image or a region
*/ 
