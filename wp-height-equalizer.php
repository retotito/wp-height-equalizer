<?php
/**
 * Plugin Name:       WP Height Equalizer
 * Plugin URI:        https://github.com/retotito/wp-height-equalizer
 * Description:       A lightweight, dependency-free Vanilla JS utility to synchronize element heights across rows. Simply add the 'equalizer-parent' class to any container.
 * Version:           1.0.0
 * Author:            Reto Küpfer
 * Author URI:        https://retokuepfer.ch
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       wp-height-equalizer
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Enqueue the equalizer script on the frontend.
 * The script is loaded in the footer for optimal performance.
 */
function wp_height_equalizer_enqueue_scripts() {
	// Standard WordPress check: Don't load in the dashboard
	if ( is_admin() ) {
		return;
	}

	wp_enqueue_script(
		'wp-height-equalizer-script',
		plugins_url( '/js/equalizer.js', __FILE__ ),
		array(),
		'1.0.0',
		true // Load in footer
	);
}
add_action( 'wp_enqueue_scripts', 'wp_height_equalizer_enqueue_scripts' );

/**
 * Add a small admin notice link to settings/documentation if needed in the future.
 * For now, this keeps the plugin clean and functional.
 */