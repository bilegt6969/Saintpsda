import React from 'react';
import Product from './product/page';
import Image from 'next/image'; // <-- Import Next.js Image component

// --- Interfaces for Frontend Component Props (HeroSectionProps) ---
interface CtaButton {
    text: string;
    url: string;
    style?: 'primary' | 'secondary' | 'outline' | 'link' | 'ghost' | 'gradient';
    size?: 'small' | 'medium' | 'large';
    icon?: string;
    iconPosition?: 'left' | 'right';
    targetBlank?: boolean;
}

interface TextStyle {
    text: string;
    color?: string;
    size?: string;
    style?: string;
    bold?: boolean;
    italic?: boolean;
    letterSpacing?: string;
    textShadow?: string;
    highlight?: string;
    transform?: string;
    decoration?: string;
}

interface MediaObject {
    url: string;
    alt?: string;
}

// Updated SideContent interface to include optional headline and text
interface SideContent {
    type: 'image' | 'video' | 'shape';
    source?: MediaObject;
    altText?: string;
    width?: string; // Still useful for styling the container
    height?: string; // Still useful for styling the container
    animation?: string;
    position?: 'left' | 'right'; // Determines order in split layouts
    offset?: string;
    zIndex?: number;
    headline?: string;
    text?: string;
}

// Removed unused GradientDirection type

interface HeroSectionProps {
    backgroundType: 'color' | 'gradient' | 'image' | 'video';
    backgroundColor?: string;
    backgroundGradient?: {
        from: string;
        to: string;
        direction?: string;
    };
    backgroundImage?: MediaObject;
    backgroundVideo?: MediaObject;
    backgroundImageOverlay?: {
        color: string;
        blendMode?: string;
    };
    contentAlignment?: {
        textAlignment?: string;
        verticalAlignment?: string;
        maxWidth?: string;
    };
    spacing?: {
        paddingTop?: string;
        paddingBottom?: string;
        paddingX?: string;
    };
    headline?: TextStyle;
    subHeadline?: TextStyle;
    supportingText?: TextStyle;
    ctaButtons?: CtaButton[];
    layoutType?: 'centered' | 'split-left-content' | 'split-right-content';
    sideContent?: SideContent[];
    divider?: {
        show: boolean;
        type?: string;
        color?: string;
        height?: string;
        position?: 'top' | 'bottom';
    };
    animation?: {
        entrance?: 'none' | 'zoom' | 'fade' | 'slide-up' | 'slide-down';
        speed?: 'medium' | 'slow' | 'fast';
        stagger?: boolean;
    };
    customClass?: string;
    minHeight?: string;
    borderRadius?: string;
    boxShadow?: string;
    darkMode?: boolean;
    darkModeBackgroundColor?: string;
}

// --- Interfaces for Raw Payload API Data ---
interface PayloadMedia {
    id: string | number;
    url: string;
    alt?: string;
    [key: string]: unknown;
}

// Use 'unknown' instead of 'any'
// Use 'unknown' instead of 'any'
function isPayloadMedia(obj: unknown): obj is PayloadMedia {
  // 1. First, ensure it's a non-null object.
  if (typeof obj !== 'object' || obj === null) {
      return false;
  }

  // 2. Now that TypeScript knows obj is an object, check for the 'url' property
  //    and ensure its value is a string.
  //    We use 'in' for robust key checking and explicitly cast inside typeof
  //    to help TS understand we're checking the property of the narrowed object.
  return 'url' in obj && typeof (obj as { url: unknown }).url === 'string';

  // Optional: If 'id' is also strictly required by PayloadMedia, you could add:
  // && 'id' in obj // && (typeof (obj as { id: unknown }).id === 'string' || typeof (obj as { id: unknown }).id === 'number');
}

type PayloadMediaInput = PayloadMedia | string | number | null | undefined;

interface PayloadTextStyle {
    text?: string;
    style?: string;
    size?: string;
    color?: string;
    bold?: boolean;
    italic?: boolean;
    letterSpacing?: string;
    textShadow?: string;
    highlight?: string;
    transform?: string;
    decoration?: string;
}

interface PayloadCtaButton {
    id?: string;
    text?: string;
    url?: string;
    style?: string;
    size?: string;
    icon?: string;
    iconPosition?: 'left' | 'right';
    customColors?: {
        background?: string;
        text?: string;
        border?: string;
        hoverBackground?: string;
        hoverText?: string;
    };
    animation?: string;
    targetBlank?: boolean;
}

interface PayloadSideContentItem {
    id?: string;
    type?: 'image' | 'video' | 'shape';
    source?: PayloadMediaInput;
    altText?: string;
    width?: string;
    height?: string;
    animation?: string;
    position?: 'left' | 'right'; // Used to determine order
    offset?: string;
    zIndex?: number;
    headline?: string;
    text?: string;
}

interface PayloadHeroSectionData {
    id: string | number;
    name?: string;
    backgroundType?: 'color' | 'gradient' | 'image' | 'video';
    backgroundColor?: string;
    backgroundImage?: PayloadMediaInput;
    backgroundVideo?: PayloadMediaInput;
    backgroundGradient?: {
        from?: string;
        to?: string;
        direction?: string;
    };
    backgroundPattern?: {
        type?: string;
        color?: string;
        opacity?: number;
        size?: string;
        animated?: boolean;
    };
    backgroundImageOverlay?: {
        color?: string;
        blendMode?: string;
    };
    contentAlignment?: {
        textAlignment?: string;
        verticalAlignment?: string;
        maxWidth?: string;
    };
    spacing?: {
        paddingTop?: string;
        paddingBottom?: string;
        paddingX?: string;
    };
    headline?: PayloadTextStyle;
    subHeadline?: PayloadTextStyle;
    supportingText?: PayloadTextStyle;
    ctaButtons?: PayloadCtaButton[];
    sideContent?: PayloadSideContentItem[];
    layoutType?: string;
    divider?: {
        show?: boolean;
        type?: string;
        color?: string;
        height?: string;
        position?: 'top' | 'bottom';
    };
    animation?: {
        entrance?: string;
        speed?: string;
        stagger?: boolean;
    };
    customClass?: string;
    minHeight?: string;
    borderRadius?: string;
    boxShadow?: string;
    darkMode?: boolean;
    darkModeBackgroundColor?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface PayloadApiResponse<T> {
    docs: T[];
    totalDocs?: number;
    limit?: number;
    totalPages?: number;
    page?: number;
    pagingCounter?: number;
    hasPrevPage?: boolean;
    hasNextPage?: boolean;
    prevPage?: number | null;
    nextPage?: number | null;
}

// --- Fetch Function ---
async function getHeroSections(): Promise<PayloadHeroSectionData | null> {
    const apiUrl = `${process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3000'}/api/hero-sections?depth=2&limit=1`;
    console.log(`Workspaceing hero sections from: ${apiUrl}`);
    try {
        const res = await fetch(apiUrl, { cache: 'no-store' });
        if (!res.ok) {
            const errorBody = await res.text();
            console.error(`Error fetching hero sections: Status ${res.status} ${res.statusText}`, {
                url: apiUrl,
                responseBody: errorBody,
            });
            return null;
        }
        console.log('Fetch successful, parsing JSON...');
        const data: PayloadApiResponse<PayloadHeroSectionData> = await res.json();
        console.log(`Received ${data?.docs?.length || 0} hero sections.`);
        return data.docs && data.docs.length > 0 ? data.docs[0] : null;
    } catch (error) {
        console.error('Caught exception in getHeroSections:', error);
        return null;
    }
}

// --- Transformation Functions ---
type AnimationEntrance = "none" | "zoom" | "fade" | "slide-up" | "slide-down";
type AnimationSpeed = "medium" | "slow" | "fast";

const transformMedia = (media: PayloadMediaInput): MediaObject | undefined => {
    if (isPayloadMedia(media) && media.url) {
        const payloadUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3000';
        const fullUrl = media.url.startsWith('http') ? media.url :
            media.url.startsWith('/') ? `${payloadUrl}${media.url}` : media.url;
        return { url: fullUrl, alt: media.alt };
    }
    if (media && (typeof media === 'string' || typeof media === 'number')) {
        console.warn('transformHeroData: Media field is an ID, population likely failed:', media);
    }
    return undefined;
};

const transformTextStyle = (payloadStyle?: PayloadTextStyle): TextStyle | undefined => {
    if (!payloadStyle || !payloadStyle.text) return undefined;
    return {
        text: payloadStyle.text,
        color: payloadStyle.color,
        size: payloadStyle.size,
        style: payloadStyle.style,
        bold: payloadStyle.bold,
        italic: payloadStyle.italic,
        letterSpacing: payloadStyle.letterSpacing,
        textShadow: payloadStyle.textShadow,
        highlight: payloadStyle.highlight,
        transform: payloadStyle.transform,
        decoration: payloadStyle.decoration,
    };
};

const transformCtaButtons = (buttons?: PayloadCtaButton[]): CtaButton[] => {
    if (!buttons || !Array.isArray(buttons)) return [];
    return buttons.map(button => ({
        text: button.text || '',
        url: button.url || '#',
        style: button.style as CtaButton['style'] || 'primary',
        size: button.size as CtaButton['size'] || 'medium',
        icon: button.icon,
        iconPosition: button.iconPosition,
        targetBlank: button.targetBlank ?? false,
    })).filter(button => button.text);
};

const transformSideContent = (items?: PayloadSideContentItem[]): SideContent[] => {
    if (!items || !Array.isArray(items)) return [];
    return items.map(item => ({
        type: item.type as SideContent['type'] || 'image',
        source: transformMedia(item.source),
        altText: item.altText,
        width: item.width,
        height: item.height,
        animation: item.animation,
        position: item.position, // Keep position for layout logic
        offset: item.offset,
        zIndex: item.zIndex,
        headline: item.headline,
        text: item.text,
    })).filter(item => item.type && (item.type !== 'image' && item.type !== 'video' || item.source));
};

const transformBackgroundGradient = (
    gradientData?: { from?: string; to?: string; direction?: string }
): { from: string; to: string; direction?: string } | undefined => {
    if (!gradientData) {
        return undefined;
    }
    const fromColor = gradientData.from || '#ffffff';
    const toColor = gradientData.to || '#f0f0f0';
    return {
        from: fromColor,
        to: toColor,
        direction: gradientData.direction,
    };
};

const transformBackgroundImageOverlay = (
    overlayData?: { color?: string; blendMode?: string }
): { color: string; blendMode?: string } | undefined => {
    if (!overlayData || typeof overlayData.color !== 'string' || overlayData.color === '') {
        return undefined;
    }
    return {
        color: overlayData.color,
        blendMode: overlayData.blendMode,
    };
};

const transformDivider = (
    dividerData?: { show?: boolean; type?: string; color?: string; height?: string; position?: 'top' | 'bottom' }
): { show: boolean; type?: string; color?: string; height?: string; position?: 'top' | 'bottom' } | undefined => {
    if (!dividerData) {
        return undefined;
    }
    return {
        ...dividerData,
        show: dividerData.show ?? false,
    };
};

const transformAnimation = (
    animationData?: { entrance?: string; speed?: string; stagger?: boolean }
): { entrance?: AnimationEntrance; speed?: AnimationSpeed; stagger?: boolean } | undefined => {
    if (!animationData) {
        return undefined;
    }

    let validEntrance: AnimationEntrance | undefined = undefined;
    const allowedEntrances: AnimationEntrance[] = ["none", "zoom", "fade", "slide-up", "slide-down"];
    if (animationData.entrance && allowedEntrances.includes(animationData.entrance as AnimationEntrance)) {
        validEntrance = animationData.entrance as AnimationEntrance;
    } else if (animationData.entrance) {
        console.warn(`Invalid animation entrance value received: "${animationData.entrance}". Defaulting.`);
        validEntrance = "none"; // Default or handle appropriately
    }

    let validSpeed: AnimationSpeed | undefined = undefined;
    const allowedSpeeds: AnimationSpeed[] = ["medium", "slow", "fast"];
    if (animationData.speed && allowedSpeeds.includes(animationData.speed as AnimationSpeed)) {
        validSpeed = animationData.speed as AnimationSpeed;
    } else if (animationData.speed) {
        console.warn(`Invalid animation speed value received: "${animationData.speed}". Defaulting.`);
        validSpeed = "medium"; // Default or handle appropriately
    }

    return {
        entrance: validEntrance,
        speed: validSpeed,
        stagger: animationData.stagger ?? false,
    };
};


// --- Main mapping ---
function transformHeroData(apiData: PayloadHeroSectionData | null): HeroSectionProps | null {
    if (!apiData) {
        console.log('transformHeroData: Received null apiData, returning null.');
        return null;
    }

    console.log('transformHeroData: Transforming API data...', { id: apiData.id });

    const props: HeroSectionProps = {
        backgroundType: (apiData.backgroundType as HeroSectionProps['backgroundType']) || 'color',
        backgroundColor: apiData.backgroundColor,
        backgroundGradient: transformBackgroundGradient(apiData.backgroundGradient),
        backgroundImage: transformMedia(apiData.backgroundImage),
        backgroundVideo: transformMedia(apiData.backgroundVideo),
        backgroundImageOverlay: transformBackgroundImageOverlay(apiData.backgroundImageOverlay),
        contentAlignment: apiData.contentAlignment,
        spacing: apiData.spacing,
        headline: transformTextStyle(apiData.headline),
        subHeadline: transformTextStyle(apiData.subHeadline),
        supportingText: transformTextStyle(apiData.supportingText),
        ctaButtons: transformCtaButtons(apiData.ctaButtons),
        // Ensure layoutType is one of the allowed values or default
        layoutType: ['centered', 'split-left-content', 'split-right-content'].includes(apiData.layoutType || '')
            ? apiData.layoutType as HeroSectionProps['layoutType']
            : 'centered',
        sideContent: transformSideContent(apiData.sideContent),
        divider: transformDivider(apiData.divider),
        animation: transformAnimation(apiData.animation),
        customClass: apiData.customClass,
        minHeight: apiData.minHeight,
        borderRadius: apiData.borderRadius,
        boxShadow: apiData.boxShadow,
        darkMode: apiData.darkMode ?? false,
        darkModeBackgroundColor: apiData.darkModeBackgroundColor,
    };

    console.log('transformHeroData: Transformation complete.');
    return props;
}

// --- Page Component ---
export default async function HomePage() {
    console.log('Rendering HomePage...');
    const rawApiData = await getHeroSections();
    const heroProps = transformHeroData(rawApiData);

    return (
        <div>
            {heroProps ? (
                <HeroSection {...heroProps} />
            ) : (
                <div className="container mx-auto py-20 text-center">
                    <h2 className="text-2xl font-semibold mb-4">Hero Section Not Found</h2>
                    <p className="text-gray-600">Could not load hero section data from the API, or no hero sections exist.</p>
                </div>
            )}
            <Product />
        </div>
    );
}

// --- Hero Section Component ---
function HeroSection({
    backgroundType,
    backgroundColor,
    backgroundGradient,
    backgroundImage,
    backgroundVideo,
    backgroundImageOverlay,
    contentAlignment,
    spacing,
    headline,
    subHeadline,
    supportingText,
    ctaButtons,
    layoutType, // Prop is now used
    sideContent,
    divider,
    animation, // Prop is now used
    customClass,
    minHeight,
    borderRadius,
    boxShadow,
    darkMode,
    darkModeBackgroundColor,
}: HeroSectionProps) {

    // Use const for backgroundStyles
    const backgroundStyles: React.CSSProperties = {};
    const backgroundStyleClasses: string[] = [];

    // --- Background ---
    if (backgroundType === 'color') {
        const bgColor = darkMode && darkModeBackgroundColor ? darkModeBackgroundColor : backgroundColor;
        backgroundStyles.backgroundColor = bgColor || '#ffffff'; // Default white
    } else if (backgroundType === 'image' && backgroundImage?.url) {
        backgroundStyles.backgroundImage = `url(${backgroundImage.url})`;
        backgroundStyleClasses.push('bg-cover', 'bg-center');
    } else if (backgroundType === 'gradient' && backgroundGradient) {
        // Safelist patterns in tailwind.config.js if directions/colors are very dynamic
        // e.g., safelist: [{ pattern: /bg-gradient-(to-r|to-l|...)/ }, { pattern: /from-(.*?)]/ }, { pattern: /to-(.*?)]/ }]
        const directionClass = `bg-gradient-${backgroundGradient.direction || 'to-r'}`;
        const fromClass = `from-[${backgroundGradient.from || '#ffffff'}]`;
        const toClass = `to-[${backgroundGradient.to || '#f0f0f0'}]`;
        backgroundStyleClasses.push(directionClass, fromClass, toClass);
    }

    // --- Layout ---
    const isSplitLayout = layoutType === 'split-left-content' || layoutType === 'split-right-content';
    const mainFlexContainerClasses = [
        'flex',
        isSplitLayout ? 'flex-col md:flex-row' : 'flex-col', // Stack on mobile, row on desktop for split
        'gap-8', // Add gap between text content and side content in split layout
         contentAlignment?.verticalAlignment || 'items-center', // Default vertical alignment
    ].filter(Boolean).join(' ');

    const textContentClasses = [
        'relative', 'z-10', // Keep text above overlays
        isSplitLayout ? 'w-full md:w-1/2' : 'w-full', // Half width on desktop for split
        contentAlignment?.textAlignment || (isSplitLayout ? 'text-left' : 'text-center'), // Default left for split, center otherwise
        layoutType === 'split-right-content' ? 'md:order-last' : '', // Move text to right if split-right
    ].filter(Boolean).join(' ');

    const sideContentContainerClasses = [
        'relative', // For positioning children like images
        isSplitLayout ? 'w-full md:w-1/2' : 'w-full', // Half width on desktop for split
        !isSplitLayout && sideContent && sideContent.length > 0 ? 'mt-12 md:mt-16' : '', // Add margin top if centered layout has side content
         layoutType === 'split-left-content' ? 'md:order-first' : '', // Keep media on left if split-left
    ].filter(Boolean).join(' ');


    // --- Animation ---
    const animationClasses: string[] = [];
    if (animation?.entrance && animation.entrance !== 'none') {
        // Map your entrance names to actual animation classes (e.g., using Tailwind variants or custom CSS)
        // This is a placeholder - replace with your actual animation implementation
        if (animation.entrance === 'fade') animationClasses.push('animate-fade-in'); // Example class
        if (animation.entrance === 'zoom') animationClasses.push('animate-zoom-in'); // Example class
        // Add classes for slide-up, slide-down etc.

        if (animation.speed === 'slow') animationClasses.push('duration-1000'); // Example duration mapping
        else if (animation.speed === 'fast') animationClasses.push('duration-300');
        else animationClasses.push('duration-700'); // Default medium
    }

    // --- Section ---
    const sectionClasses = [
        'relative', 'overflow-hidden', // Base section styles
        spacing?.paddingTop || 'pt-20',
        spacing?.paddingBottom || 'pb-20',
        spacing?.paddingX || 'px-6',
        minHeight || 'min-h-[80vh]',
        borderRadius || 'rounded-none',
        boxShadow || 'shadow-none',
        darkMode ? 'text-white dark' : 'text-gray-900',
        customClass || '',
        ...backgroundStyleClasses,
        ...animationClasses, // Apply animation classes
    ].filter(Boolean).join(' ');

    // --- Content Wrapper ---
     const contentWrapperClasses = [
        'relative', 'z-10', // Position above background video/overlay
        'w-full', 'mx-auto',
        contentAlignment?.maxWidth || (isSplitLayout ? 'max-w-7xl' : 'max-w-4xl'), // Wider max-width for split layouts potentially
        mainFlexContainerClasses, // Apply flex layout defined above
    ].filter(Boolean).join(' ');

    // --- Render ---
    return (
        <section className={sectionClasses} style={backgroundStyles}>
            {/* Background Video */}
            {backgroundType === 'video' && backgroundVideo?.url && (
                <video
                    key={backgroundVideo.url}
                    src={backgroundVideo.url}
                    autoPlay loop muted playsInline
                    className="absolute inset-0 w-full h-full object-cover -z-10" // z-index -10 to be behind overlay
                />
            )}

            {/* Background Image Overlay */}
            {backgroundImageOverlay?.color && (
                <div
                    className={`absolute inset-0 z-0 ${backgroundImageOverlay.blendMode || 'mix-blend-normal'}`} // z-index 0
                    style={{ backgroundColor: backgroundImageOverlay.color }}
                />
            )}

            {/* Main Content Wrapper */}
            <div className={contentWrapperClasses}>

                {/* Text Content Area */}
                <div className={textContentClasses}>
                    {headline?.text && (
                        <h1
                            className={`
                                ${headline.style || 'font-sans'} ${headline.size || 'text-5xl md:text-7xl'} ${headline.bold ? 'font-bold' : 'font-medium'} ${headline.italic ? 'italic' : ''} ${headline.letterSpacing || 'tracking-tight'} ${headline.transform || 'normal-case'} ${headline.decoration || 'no-underline'}
                                mb-4
                            `}
                            style={{ color: headline.color ?? (darkMode ? '#f5f5f7' : '#1d1d1f'), textShadow: headline.textShadow }}
                        >
                            {headline.text}
                        </h1>
                    )}
                    {subHeadline?.text && (
                        <h2
                            className={`
                                ${subHeadline.style || 'font-sans'} ${subHeadline.size || 'text-xl md:text-2xl'} ${subHeadline.bold ? 'font-semibold' : 'font-normal'} ${subHeadline.italic ? 'italic' : ''} ${subHeadline.letterSpacing || 'tracking-normal'} ${subHeadline.transform || 'normal-case'} ${subHeadline.decoration || 'no-underline'}
                                mb-6 opacity-80 // Slightly faded subheadline common
                            `}
                            style={{ color: subHeadline.color ?? (darkMode ? '#a1a1a6' : '#6e6e73'), textShadow: subHeadline.textShadow }}
                        >
                            {subHeadline.text}
                        </h2>
                    )}
                     {supportingText?.text && (
                        <p
                            className={`
                                ${supportingText.style || 'font-sans'} ${supportingText.size || 'text-lg'} ${supportingText.bold ? 'font-semibold' : 'font-normal'} ${supportingText.italic ? 'italic' : ''} ${supportingText.letterSpacing || 'tracking-normal'} ${supportingText.transform || 'normal-case'} ${supportingText.decoration || 'no-underline'}
                                max-w-prose
                                ${contentAlignment?.textAlignment === 'text-center' && !isSplitLayout ? 'mx-auto' : ''} // Center only if text-center AND not split layout
                                mb-8
                            `}
                            style={{ color: supportingText.color ?? (darkMode ? '#f5f5f7' : '#1d1d1f'), textShadow: supportingText.textShadow }}
                        >
                            {supportingText.text}
                        </p>
                     )}
                    {ctaButtons && ctaButtons.length > 0 && (
                        <div className={`flex flex-wrap gap-4 ${contentAlignment?.textAlignment === 'text-center' && !isSplitLayout ? 'justify-center' : 'justify-start'}`}>
                            {ctaButtons.map((button, index) => (
                                <a
                                    key={index}
                                    href={button.url}
                                    target={button.targetBlank ? '_blank' : '_self'}
                                    rel={button.targetBlank ? 'noopener noreferrer' : undefined}
                                    className={`
                                        inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                                        ${button.size === 'large' ? 'px-6 py-3 text-lg' : button.size === 'small' ? 'px-4 py-1.5 text-sm' : 'px-5 py-2.5 text-base'}
                                        ${button.style === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500' : ''}
                                        ${button.style === 'secondary' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400' : ''}
                                        ${button.style === 'link' ? 'text-blue-600 hover:underline px-1 py-1 focus:ring-blue-500' : ''}
                                        ${button.style === 'outline' ? 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500' : ''}
                                        ${button.style === 'ghost' ? 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500' : ''}
                                        ${/* Add gradient styles if needed */''}
                                    `}
                                >
                                    {button.icon && button.iconPosition === 'left' && <span className="mr-2">{/* Icon Comp */}</span>}
                                    {button.text}
                                    {button.icon && button.iconPosition === 'right' && <span className="ml-2">{/* Icon Comp */}</span>}
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* Side Content Area */}
                {sideContent && sideContent.length > 0 && (
                    <div className={sideContentContainerClasses}>
                        {/* Example: Render only the first side content item for simplicity in split view */}
                        {/* More complex logic needed for multiple items */}
                        {sideContent.map((item, index) => (
                             // Only render if split layout OR if it's the first item in a centered layout (adjust as needed)
                            (isSplitLayout || index === 0) && (
                                <div
                                    key={index}
                                    className="relative w-full" // Container for image/video/shape
                                     // Apply item-specific width/height to this container
                                     style={{
                                         width: item.width || 'auto',
                                         height: item.height || 'auto',
                                         zIndex: item.zIndex,
                                         // Apply offset if needed (using transform translate potentially)
                                         // transform: item.offset ? `translateX(${item.offset})` : undefined,
                                     }}
                                >
                                    {item.type === 'image' && item.source?.url && (
                                        <div className={`relative w-full h-full overflow-hidden rounded-lg shadow-md ${item.animation || ''}`}>
                                            <Image // Use Next.js Image
                                                src={item.source.url}
                                                alt={item.altText || 'Hero side content'}
                                                layout="fill" // Fill the container
                                                objectFit="cover" // Cover the area
                                                // Add sizes prop for better performance if you know layout breakpoints
                                                // sizes="(max-width: 768px) 100vw, 50vw"
                                                priority={index === 0} // Prioritize loading the first image (good for LCP)
                                            />
                                        </div>
                                    )}
                                    {item.type === 'video' && item.source?.url && (
                                        <video
                                            src={item.source.url}
                                            controls
                                            className={`w-full h-full object-cover rounded-lg shadow-md ${item.animation || ''}`} // Ensure video covers its area
                                        />
                                    )}
                                    {item.type === 'shape' && (
                                        <div className="p-6 bg-gray-100 rounded-lg shadow-md"> {/* Example shape */}
                                            <p>Shape: {item.headline || 'Decorative Element'}</p>
                                        </div>
                                    )}
                                    {/* Headline/Text associated with the side item */}
                                    {item.headline && <h3 className="mt-4 text-xl font-semibold">{item.headline}</h3>}
                                    {item.text && <p className="mt-2 opacity-90">{item.text}</p>}
                                </div>
                            )
                        ))}
                    </div>
                )}

            </div> {/* End Content Wrapper */}

            {/* Divider */}
            {divider?.show && (
                <div
                    className={`absolute w-full ${divider.position === 'top' ? 'top-0 border-t' : 'bottom-0 border-b'} z-5`} // Ensure divider is above background but below content if needed
                    style={{
                        borderColor: divider.color || 'currentColor',
                        borderWidth: divider.height || '1px',
                        // Add SVG/pseudo-element logic here for complex types (wave, curve)
                    }}
                ></div>
            )}
        </section>
    );
}