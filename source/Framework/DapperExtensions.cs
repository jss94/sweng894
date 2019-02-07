using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static Dapper.SqlMapper;

namespace source.Framework
{
    public static class DapperExtensions
    {
        /// <summary>
        /// Instructions for use: This extension maps child objects along with parent objects 
        /// on one round trip call to the database. Note that the stored procedure or sql 
        /// query used must return query results as verticle partitions (aka multiple results grids).
        /// </summary>
        public static async Task<IEnumerable<TFirst>> Map<TFirst, TSecond, TKey>
            (this GridReader newReader, Func<TFirst, TKey> firstKey, Func<TSecond, TKey> secondKey, 
            Action<TFirst, IEnumerable<TSecond>> addChildren)
        {
            var first = newReader.Read<TFirst>().ToList();
            var childMap = newReader
                .Read<TSecond>()
                .GroupBy(s => secondKey(s))
                .ToDictionary(g => g.Key, g => g.AsEnumerable());

            foreach (var item in first)
            {
                IEnumerable<TSecond> children;
                if (childMap.TryGetValue(firstKey(item), out children))
                {
                    addChildren(item, children);
                }
            }

            return first;
        }      
    }
}
