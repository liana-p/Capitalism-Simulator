/** Balance data for all upgrades in the game */

import { IUpgradeData } from '@/interfaces/UpgradeTypes';

export const upgradesData: IUpgradeData[] = [
    {
        id: 'ice_cream_boost_1',
        name: 'New ice cooler model',
        cost: 5000,
        effect: {
            type: 'multiply-revenue',
            options: {
                target: 'ice_cream',
                amount: 3,
            },
        },
    },
    {
        id: 'corner_shop_boost_1',
        name: 'Self service checkout',
        cost: 20000,
        effect: {
            type: 'multiply-revenue',
            options: {
                target: 'corner_shop',
                amount: 3,
            },
        },
    },
    {
        id: 'car_wash_boost_1',
        name: 'Automatic car wash',
        cost: 55000,
        effect: {
            type: 'multiply-revenue',
            options: {
                target: 'car_wash',
                amount: 3,
            },
        },
    },
    {
        id: 'all_boost_1',
        name: 'New investment strategy',
        cost: 210000,
        effect: {
            type: 'multiply-revenue',
            options: {
                target: 'all',
                amount: 3,
            },
        },
    },
];
