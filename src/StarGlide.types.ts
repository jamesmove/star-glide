// src/StarGlide.types.ts

export interface StarGlideProps {
  /**
   * The id (just the value without any #) of the container of the star-glide component.
   * We need it to activate all features and enable the use of multiple star-glide component
   */
  containerKey: string;
  /**
   * The background color of icons on hover or fill with specific value.
   * Only these color can be apply now or his rgb or hex equivalent ["black","green","red","blue","yellow","orange","purple"].
   * If undefined or set with an non permit value the default "gold" color will be apply.
   */
  fillColor?: string;
  /**
   * The rating value of the star-glide component.
   */
  rating?: number;
  /**
   * The desire number of icons of the star-glide component.
   */
  iconsCount?: number;
  /**
   * The width of one star element for the star-glide container.
   */
  size?: number;
  
  /**
   * Callback that fire when the user pointer leave the star-glide component
   * @param {number} rating the rating value
   * @param {number} size the width of the container
   * @param {number} maxIcons the number of icons
   * @returns {void} 
   */
  onPointerLeave?: ((rating: number, size: number, maxIcons: number) => void) | null;
  /**
   * Callback that fire when the user pointer click on a value of the star-glide component
   * @param {number} rating the rating value
   * @param {number} size the width of the container
   * @param {number} maxIcons the number of icons
   * @returns {void} 
   */
  onPointerClick?: ((rating: number, size: number, maxIcons: number) => void) | null;
  
  /**
   * Callback that fire when the user move the pointer accross the star-glide component
   * @param {number} rating the rating value
   * @param {number} size the width of the container
   * @param {number} maxIcons the number of icons
   * @returns {void} 
   */
  onPointerMove?: ((rating: number, size: number, maxIcons: number) => void) | null;
  /**
   * The string className definie here will be apply on the first container of the star-glide component.
   * It can be usefull to position the component or add other style effect on children.
   */
  className?: string;
  /**
   * Show or not a tooltip of the current rating value on hover or not.
   */
  showTooltip?: boolean;
  /**
   * Apply or not a default transition on a hover effect of the component.
   * This will slow a bit the hover.
   */
  transition?: boolean;
  /**
   * Define wether the star-glide component will be editable after click on a value or not.
   */
  staleOnClick?: boolean;
  /**
   * Define wether the star-glide component will be editable or not.
   */
  readOnly?: boolean;
  /**
   * The title that will appear on hover of the star-glide component.
   */
  ratingTitle?: string;
}

export interface FillColorSpec {
  rgb: string;
  hex: string;
  filter: string;
}