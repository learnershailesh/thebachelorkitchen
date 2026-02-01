import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, url, image }) => {
    const siteTitle = "The Bachelor's Kitchens | Authentic Ghar Ka Khana";
    const defaultDescription = "Freshly cooked, homely meals delivered daily on subscription. A feeling of home for bachelors, students, and professionals away from home.";
    const defaultKeywords = "tiffin service, homemade food delivery, bachelors kitchen, student meals, healthy food delivery, north indian food, south indian food, varanasi tiffin service";
    const siteUrl = "https://thebachelorskitchens.com";
    const defaultImage = "https://thebachelorskitchens.com/hero_tiffin.png";

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{title ? `${title} | The Bachelor's Kitchens` : siteTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || defaultKeywords} />
            <link rel="canonical" href={url ? `${siteUrl}${url}` : siteUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url ? `${siteUrl}${url}` : siteUrl} />
            <meta property="og:title" content={title || siteTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={image || defaultImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url ? `${siteUrl}${url}` : siteUrl} />
            <meta property="twitter:title" content={title || siteTitle} />
            <meta property="twitter:description" content={description || defaultDescription} />
            <meta property="twitter:image" content={image || defaultImage} />
        </Helmet>
    );
};

export default SEO;
