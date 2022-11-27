using System.Threading.Tasks;
using VkNet;
using VkNet.Model;

namespace VkGraphBuilder.BusinessLogic
{
    public class VkApiClientFactory
    {
        private const string Token =
            "vk1.a._ZKAA6FQEOzBz406xwn35ZvoCUpwSLoO5CO7vbyZ5SgqsYvqeba5G0F_u6IW-MjOhkz-8j9ETOSncaGS60x8ApXw9KgWhWcp8IVM0TMfNmdSSjcacZY4oKKUYPgmOKpyVXdaSFICTuEAM3QhfzXmUqZn0LPG3dyJfnJ2p3H6ZdcSXyuLT7OTipK7KQ9uNWX2";

        public async Task<VkApi> GetInstanceAsync()
        {
            VkApi vkApi = new();
            await vkApi.AuthorizeAsync(new ApiAuthParams { AccessToken = Token });

            return vkApi;
        }
    }
}