import AuthAPI from './auth';
import CategoriesAPI from './categories';
import DonationsAPI from './donations';
import NPOOrganizationAPI from './npoOrganizations';
import ReportsAPI from './reports';
import ReviewsAPI from './reviews';
import UsersAPI from './users';
import WishesAPI from './wishes';
import BannersAPI from './banners';
import TermsAndConditionsAPI from './termsandconditions';
import ChatsAPI from './chats';
import LogisticsAPI from './logistics';

class API {
  auth = new AuthAPI();
  categories = new CategoriesAPI();
  donations = new DonationsAPI();
  npoOrganization = new NPOOrganizationAPI();
  reports = new ReportsAPI();
  reviews = new ReviewsAPI();
  users = new UsersAPI();
  wishes = new WishesAPI();
  banners = new BannersAPI();
  termsandconditions = new TermsAndConditionsAPI();
  chats = new ChatsAPI();
  logistics = new LogisticsAPI();
}

const api = new API();

export default api;
