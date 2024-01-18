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
    // await recreateWalletsDB();
    await createWalletsTable();
    const walletsFromDb = await selectWallets();

    return walletsFromDb;
}

export const getPortfolio = async () => {
    const walletsFromDb = await getWallets();
    recreatePortfolioDB();
    const positionsData = await fetchWalletPositions(walletsFromDb?.map(wallet => wallet.address));
    if (positionsData.length) {
      await updatePortfolio(positionsData);
    }

    const portfolioFromDb = await selectPortfolio();
    return portfolioFromDb;
}

export const getBalancies = async () => {
    const walletsFromDb = await getWallets();
    recreateBalanciesDB();
    walletsFromDb.forEach(async (wallet) => {
        const walletData = await getWalletBalance(wallet.address);
        const { positions_distribution_by_chain = {} } = walletData?.data?.attributes;
        if (positions_distribution_by_chain) {
            const positionsByChain = Object.keys(positions_distribution_by_chain).reduce((accumulator, currentValue) => {
                accumulator.push({ chain: currentValue, value: positions_distribution_by_chain[currentValue], address: wallet.address });
                return accumulator;
            }, []);
            positionsByChain.length > 0 && saveBalancies(positionsByChain);
        }
    });

    const balanciedFromDb = await selectBalancies();
    return balanciedFromDb;
}