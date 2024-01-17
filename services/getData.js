import { fetchWalletPositions, getWalletBalance } from './zerionApi';
import {
    recreateWalletsDB,
    recreatePortfolioDB,
    createWalletsTable,
    selectWallets,
    updatePortfolio,
    selectPortfolio,
    addWallet,
    recreateBalanciesDB,
    selectBalancies,
    saveBalancies
} from "../db";

export const getWallets = async () => {
    await createWalletsTable();
    const walletsFromDb = await selectWallets();

    return walletsFromDb;
}

export const getPortfolio = async () => {
    recreatePortfolioDB();
    const positionsData = await fetchWalletPositions(walletsFromDb?.map(wallet => wallet.address));
    if (positionsData.length) {
      await updatePortfolio(positionsData);
    }

    const portfolioFromDb = await selectPortfolio();
    return portfolioFromDb;
}

export const getBalancies = async () => {
    recreateBalanciesDB();
    walletsFromDb.forEach(async (wallet) => {
        const walletData = await getWalletBalance(wallet.address);
        addWallet({ ...wallet, total: walletData?.data?.attributes?.total?.positions || 0 });
        const { positions_distribution_by_chain = {} } = walletData?.data?.attributes;
        if (positions_distribution_by_chain) {
            const positionsByChain = Object.keys(positions_distribution_by_chain).reduce((
                (accumulator, currentValue) => accumulator.push({ chain: currentValue, value: positionsByChain[currentValue], address: walletData.address }),
                []
            ));
            saveBalancies(positionsByChain);
        }
    });

    const balanciedFromDb = await selectBalancies();
    return balanciedFromDb;
}