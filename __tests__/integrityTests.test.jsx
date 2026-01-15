import React from 'react';
import { render } from '@testing-library/react-native';
import MuscleMapSVG from '../Components/MuscleMap/MuscleMapSVG';
import { useUserProfileStore } from '../ZustandStores/UserProfileStore';

jest.mock('../ZustandStores/UserProfileStore', () => ({
    useUserProfileStore: jest.fn(),
}));

jest.mock('react-native-svg', () => {
    const React = require('react');
    return {
        Svg: ({ children }) => <>{children}</>,
        G: ({ children }) => <>{children}</>,
    };
});

const MockLayer = ({ fill }) => (
    <mock-layer testID={`layer-${fill}`} />
);

describe('MuscleMapSVG – integration', () => {
    beforeEach(() => {
        useUserProfileStore.mockReturnValue({
            goal: 'hypertrophy',
        });
    });

    test('render warstw z kolorem zależnym od objętości i celu', () => {
        const layers = [
            { name: 'piersiowy', Component: ({ fill }) => <layer fill={fill} /> },
            { name: 'najszerszy', Component: ({ fill }) => <layer fill={fill} /> },
        ];

        const muscleVolumes = {
            piersiowy: 2000,
            najszerszy: 100,
        };

        const { UNSAFE_queryAllByType } = render(
            <MuscleMapSVG layers={layers} muscleVolumes={muscleVolumes} />
        );

        const renderedLayers = UNSAFE_queryAllByType('layer');

        expect(renderedLayers).toHaveLength(2);
        expect(renderedLayers[0].props.fill).not.toBe('black');
        expect(renderedLayers[1].props.fill).not.toBe('black');
    });
});