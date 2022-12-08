import { Pool, getNumPools, getPools } from './osmosis';

export const getOsmosisPools = async (
  paginationLimit: number = 100,
): Promise<Pool[]> => {
  const { num_pools } = await getNumPools();
  const numberOfPools = parseInt(num_pools);
  const totalPages = Math.ceil(numberOfPools / 100);

  const promises: Promise<Pool[]>[] = new Array(totalPages)
    .fill(0)
    .map((_, page) => {
      const promise = getPools({
        pagination: {
          offset: page * paginationLimit,
          limit: paginationLimit,
        },
      })
        .then((res) => res.pools)
        .catch((e) => {
          console.error(e);
          return [];
        });
      return promise;
    });

  return (await Promise.all(promises)).flat();
};
