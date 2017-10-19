/* @flow */

import { I18nManager } from 'react-native';

import type {
  NavigationSceneRendererProps,
  AnimatedViewStyleProp,
} from '../../TypeDefinition';

import animatedInterpolate from '../../utils/animatedInterpolate';

/**
 * Utility that builds the style for the card in the cards stack.
 *
 *     +------------+
 *   +-+            |
 * +-+ |            |
 * | | |            |
 * | | |  Focused   |
 * | | |   Card     |
 * | | |            |
 * +-+ |            |
 *   +-+            |
 *     +------------+
 */

/**
 * Render the initial style when the initial layout isn't measured yet.
 */
function forInitial(
  props: NavigationSceneRendererProps
): AnimatedViewStyleProp {
  const { navigation, scene } = props;

  const focused = navigation.state.index === scene.index;
  const opacity = focused ? 1 : 0;
  // If not focused, move the scene far away.
  const translate = focused ? 0 : 1000000;
  return {
    opacity,
    transform: [{ translateX: translate }, { translateY: translate }],
  };
}

/**
 * Standard iOS-style slide in from the right.
 */
function forHorizontal(
  props: NavigationSceneRendererProps
): AnimatedViewStyleProp {
  const { layout, position, scene } = props;

  if (!layout.isMeasured) {
    return forInitial(props);
  }

  const index = scene.index;
  const width = layout.initWidth;
  const interpolate = animatedInterpolate(props);

  if (!interpolate) return { opacity: 0 };

  // Add [index - 1, index - 0.99] to the interpolated opacity for screen transition.
  // This makes the screen's shadow to disappear smoothly.
  const opacity = position.interpolate({
    inputRange: ([
      interpolate.first,
      interpolate.first + 0.01,
      index,
      interpolate.last - 0.01,
      interpolate.last,
    ]: Array<number>),
    outputRange: ([0, 1, 1, 0.85, 0]: Array<number>),
  });

  const translateY = 0;
  const translateX = position.interpolate({
    inputRange: ([interpolate.first, index, interpolate.last]: Array<number>),
    outputRange: I18nManager.isRTL
      ? ([-width, 0, width * 0.3]: Array<number>)
      : ([width, 0, width * -0.3]: Array<number>),
  });

  return {
    opacity,
    transform: [{ translateX }, { translateY }],
  };
}

/**
 * Standard iOS-style slide in from the bottom (used for modals).
 */
function forVertical(
  props: NavigationSceneRendererProps
): AnimatedViewStyleProp {
  const { layout, position, scene } = props;

  if (!layout.isMeasured) {
    return forInitial(props);
  }

  const index = scene.index;
  const height = layout.initHeight;
  const interpolate = animatedInterpolate(props);

  if (!interpolate) return { opacity: 0 };

  const opacity = position.interpolate({
    inputRange: ([
      interpolate.first,
      interpolate.first + 0.01,
      index,
      interpolate.last - 0.01,
      interpolate.last,
    ]: Array<number>),
    outputRange: ([0, 1, 1, 0.85, 0]: Array<number>),
  });

  const translateX = 0;
  const translateY = position.interpolate({
    inputRange: ([interpolate.first, index, interpolate.last]: Array<number>),
    outputRange: ([height, 0, 0]: Array<number>),
  });

  return {
    opacity,
    transform: [{ translateX }, { translateY }],
  };
}

/**
 * Standard Android-style fade in from the bottom.
 */
function forFadeFromBottomAndroid(
  props: NavigationSceneRendererProps
): AnimatedViewStyleProp {
  const { layout, position, scene } = props;

  if (!layout.isMeasured) {
    return forInitial(props);
  }

  const index = scene.index;
  const interpolate = animatedInterpolate(props);

  if (!interpolate) return { opacity: 0 };

  const inputRange = ([
    interpolate.first,
    index,
    interpolate.last - 0.01,
    interpolate.last,
  ]: Array<number>);

  const opacity = position.interpolate({
    inputRange,
    outputRange: ([0, 1, 1, 0]: Array<number>),
  });

  const translateX = 0;
  const translateY = position.interpolate({
    inputRange,
    outputRange: ([50, 0, 0, 0]: Array<number>),
  });

  return {
    opacity,
    transform: [{ translateX }, { translateY }],
  };
}

/**
 *  fadeIn and fadeOut
 */
function forFade(props: NavigationSceneRendererProps): AnimatedViewStyleProp {
  const { layout, position, scene } = props;

  if (!layout.isMeasured) {
    return forInitial(props);
  }

  const index = scene.index;
  const interpolate = animatedInterpolate(props);

  if (!interpolate) return { opacity: 0 };

  const opacity = position.interpolate({
    inputRange: ([interpolate.first, index, interpolate.last]: Array<number>),
    outputRange: ([0, 1, 1]: Array<number>),
  });

  return {
    opacity,
  };
}

function canUseNativeDriver(): boolean {
  // The native driver can be enabled for this interpolator animating
  // opacity, translateX, and translateY is supported by the native animation
  // driver on iOS and Android.
  return true;
}

export default {
  forHorizontal,
  forVertical,
  forFadeFromBottomAndroid,
  forFade,
  canUseNativeDriver,
};
