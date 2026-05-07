const path = require("path");

module.exports = function (eleventyConfig) {
  // Process .html files as Nunjucks so templates work
  // (front matter + layout: base.njk)
  eleventyConfig.setNunjucksEnvironmentOptions({ trimBlocks: true, lstripBlocks: true });

  // Static asset passthrough — keep originals in root, copy to _site/
  eleventyConfig.addPassthroughCopy({ "css":    "css"    });
  eleventyConfig.addPassthroughCopy({ "js":     "js"     });
  eleventyConfig.addPassthroughCopy({ "images": "images" });
  eleventyConfig.addPassthroughCopy({ "fonts":  "fonts"  });
  eleventyConfig.addPassthroughCopy({ "data":   "data"   });

  // Root files
  eleventyConfig.addPassthroughCopy({ "favicon.jpg":  "favicon.jpg"  });
  eleventyConfig.addPassthroughCopy({ "favicon.ico":  "favicon.ico"  });
  eleventyConfig.addPassthroughCopy({ "favicon.png":  "favicon.png"  });
  eleventyConfig.addPassthroughCopy({ "robots.txt":   "robots.txt"   });
  eleventyConfig.addPassthroughCopy({ "sitemap.xml":  "sitemap.xml"  });
  eleventyConfig.addPassthroughCopy({ "googlec1e17be5846de750.html": "googlec1e17be5846de750.html" });

  return {
    dir: {
      input:    "src",
      output:   "_site",
      includes: "_includes",
      data:     "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
