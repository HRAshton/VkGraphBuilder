using Microsoft.AspNetCore.Mvc;

namespace VkGraphBuilder.WebUI.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return RedirectToActionPermanent("Friends");
        }
        
        public IActionResult Friends()
        {
            return View();
        }

        public IActionResult Groups()
        {
            return View();
        }
    }
}