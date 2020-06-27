export interface IFactorySave {
    owned: number;
    lastTick: number;
    hasManager: boolean;
    running: boolean;
}
export type FactoriesSave = IFactorySave[];

export interface IUpgradeSave {
  owned: boolean;
}
export type UpgradesSave = IUpgradeSave[];

export type MoneySave = MoneyUpdate;

export interface MoneyUpdate {
    time: number;
    money: number;
}

export interface ITimeSave {
    time: number;
    lastUpdate: number;
}

export interface IGameSave {
    factories: FactoriesSave;
    money: MoneySave;
    time: ITimeSave;
    upgrades: UpgradesSave;
}
