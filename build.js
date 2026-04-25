const fs = require('fs-extra');
const { minify } = require('html-minifier');
const CleanCSS = require('clean-css');
const Terser = require('terser');
const path = require('path');

async function build() {
    console.log('Starting build and minification process...');

    try {
        const outDir = path.join(__dirname, 'public');

        // 1. Clean and create public directory
        await fs.emptyDir(outDir);

        // 2. Define files to copy and minify
        const filesToProcess = ['index.html', 'styles.css', 'main.js', 'translations.js'];
        
        // 3. Define directories/files to copy as-is
        const itemsToCopy = ['gallary', 'lotus-3d-icon.png', 'lotus_logo_3d_transparent_v1_1774705729375-removebg-preview.png', 'lotus_logo_3d_transparent_v1_1774705729375.png'];

        // Copy processable files to public first
        for (const file of filesToProcess) {
            const srcPath = path.join(__dirname, file);
            const destPath = path.join(outDir, file);
            if (await fs.pathExists(srcPath)) {
                await fs.copy(srcPath, destPath);
            }
        }

        // Copy other assets
        for (const item of itemsToCopy) {
            const srcPath = path.join(__dirname, item);
            const destPath = path.join(outDir, item);
            if (await fs.pathExists(srcPath)) {
                await fs.copy(srcPath, destPath);
            }
        }

        // Minify HTML in public
        const htmlPath = path.join(outDir, 'index.html');
        if (await fs.pathExists(htmlPath)) {
            const htmlContent = await fs.readFile(htmlPath, 'utf8');
            const minifiedHtml = minify(htmlContent, {
                collapseWhitespace: true,
                removeComments: true,
                minifyCSS: true,
                minifyJS: true
            });
            await fs.writeFile(htmlPath, minifiedHtml);
            console.log('✅ Minified index.html');
        }

        // Minify CSS in public
        const cssPath = path.join(outDir, 'styles.css');
        if (await fs.pathExists(cssPath)) {
            const cssContent = await fs.readFile(cssPath, 'utf8');
            const minifiedCss = new CleanCSS({}).minify(cssContent).styles;
            await fs.writeFile(cssPath, minifiedCss);
            console.log('✅ Minified styles.css');
        }

        // Minify JS - main.js in public
        const mainJsPath = path.join(outDir, 'main.js');
        if (await fs.pathExists(mainJsPath)) {
            const mainJsContent = await fs.readFile(mainJsPath, 'utf8');
            const minifiedMainJs = await Terser.minify(mainJsContent);
            if (minifiedMainJs.error) throw minifiedMainJs.error;
            await fs.writeFile(mainJsPath, minifiedMainJs.code);
            console.log('✅ Minified main.js');
        }

        // Minify JS - translations.js in public
        const transJsPath = path.join(outDir, 'translations.js');
        if (await fs.pathExists(transJsPath)) {
            const transJsContent = await fs.readFile(transJsPath, 'utf8');
            const minifiedTransJs = await Terser.minify(transJsContent);
            if (minifiedTransJs.error) throw minifiedTransJs.error;
            await fs.writeFile(transJsPath, minifiedTransJs.code);
            console.log('✅ Minified translations.js');
        }

        console.log('✨ Build completed successfully! Output is in the "public" directory.');
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

build();
