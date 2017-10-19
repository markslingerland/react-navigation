/* @flow */

import { I18nManager } from 'react-native';

import type {
  NavigationSceneRendererProps,
  NavigationScene,
  AnimatedViewStyleProp,
} from '../../TypeDefinition';

import animatedInterpolate from '../../utils/animatedInterpolate';

/**
 * Utility that builds the style for the navigation header.
 *
 * +-------------+-------------+-------------+
 * |             |             |             |
 * |    Left     |   Title     |   Right     |
 * |  Component  |  Component  | Component   |
 * |             |             |             |
 * +-------------+-------------+-------------+
 */

function forLeft(props: NavigationSceneRendererProps): AnimatedViewStyleProp {
  const { position, scene, scenes } = props;
  const { index } = scene;
  const interpolate = animatedInterpolate(props);

  if (!interpolate) return { opacity: 0 };

  const activeScene = scenes.find((item: NavigationScene) => item.isActive);
  const activeIndex = scenes.findIndex(
    (item: NavigationScene) => item === activeScene
  );
  const currentIndex = scenes.findIndex(
    (item: NavigationScene) => item === scene
  );
  const deviation = Math.abs((activeIndex - currentIndex) / 2);

  return {
    opacity: position.interpolate({
      inputRange: [
        interpolate.first,
        interpolate.first + deviation,
        index,
        interpolate.last - deviation,
        interpolate.last,
      ],
      outputRange: ([0, 0, 1, 0, 0]: Array<number>),
    }),
  };
}

function forCenter(props: NavigationSceneRendererProps): AnimatedViewStyleProp {
  const { position, scene } = props;
  const { index } = scene;
  const interpolate = animatedInterpolate(props);

  if (!interpolate) return { opacity: 0 };

  const inputRange = [interpolate.first, index, interpolate.last];

  return {
    opacity: position.interpolate({
      inputRange,
      outputRange: ([0, 1, 0]: Array<number>),
    }),
    transform: [
      {
        translateX: position.interpolate({
          inputRange,
          outputRange: I18nManager.isRTL
            ? ([-200, 0, 200]: Array<number>)
            : ([200, 0, -200]: Array<number>),
        }),
      },
    ],
  };
}

function forRight(props: NavigationSceneRendererProps): AnimatedViewStyleProp {
  const { position, scene } = props;
  const { index } = scene;
  const interpolate = animatedInterpolate(props);

  if (!interpolate) return { opacity: 0 };

  return {
    opacity: position.interpolate({
      inputRange: [interpolate.first, index, interpolate.last],
      outputRange: ([0, 1, 0]: Array<number>),
    }),
  };
}

export default {
  forLeft,
  forCenter,
  forRight,
};
