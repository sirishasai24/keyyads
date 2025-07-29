import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import clsx from "clsx";
import { FormValues } from "../AddPropertyForm";
import { useState, useEffect } from "react";
import axios from "axios"; // Import axios

type PropertyDetailsStepProps = {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  watch: UseFormWatch<FormValues>;
  inputClass: string;
  errorClass: string;
};

type User = {
  _id: string;
  username: string;
  phone?: number;
  email: string;
  isVerified: boolean;
  role: string;
  profileImageURL: string;
  phoneVerified: boolean;
  premiumBadging: number;
};

const indiaStatesAndUTs = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Lakshadweep", "Puducherry", "Ladakh", "Jammu and Kashmir"];

const citiesByState: { [key: string]: string[] } = {
  "Andhra Pradesh": ["visakhapatnam", "vijayawada", "guntur", "nellore", "kurnool", "rajahmundry", "tirupati", "kakinada", "ongole", "eluru", "machilipatnam", "kadapa", "anantapur", "chittoor", "srikakulam", "vizianagaram", "tenali", "proddatur", "adoni", "bhimavaram", "madanapalle", "guntakal", "dharmavaram", "gudivada", "narasaraopet", "tadepalligudem", "amaravati", "amalapuram", "chilakaluripet", "palakollu", "rayachoti", "tadipatri", "nandyal", "sattenapalle", "ponnur", "kovvur", "markapur", "kandukur", "piduguralla", "mangalagiri", "nuzvid", "samalkota", "vinukonda", "yemmiganur", "sullurpeta", "pulivendula", "punganur", "renigunta", "chirala", "venkatagiri", "nagari", "kuppam", "parvathipuram", "giddalur", "pithapuram", "ramachandrapuram", "mandapeta", "yelamanchili"],
  "Arunachal Pradesh": ["itanagar", "naharlagun", "pasighat", "tawang", "bomdila", "ziro", "along", "roing"],
  Assam: ["guwahati", "silchar", "dibrugarh", "jorhat", "nagaon", "tinsukia", "tezpur", "bongaigaon", "goalpara", "karimganj"],
  Bihar: ["patna", "gaya", "bhagalpur", "muzaffarpur", "darbhanga", "arrah", "munger", "purnia", "saharsa", "katihar", "chhapra", "bettiah", "motihari", "begusarai", "siwan", "gopalganj", "madhubani", "samastipur", "kishanganj"],
  Chhattisgarh: ["raipur", "bhilai", "durg", "bilaspur", "korba", "rajnandgaon", "ambikapur", "jagdalpur", "chirmiri", "dhamtari"],
  Goa: ["panaji", "margao", "vasco da gama", "mapusa", "ponda", "curchorem", "sanquelim", "valpoi", "cuncolim"],
  Gujarat: ["ahmedabad", "surat", "vadodara", "rajkot", "bhavnagar", "jamnagar", "gandhinagar", "anand", "nadiad", "porbandar", "junagadh", "morbi", "bharuch", "surendranagar", "mehsana", "bhuj", "veraval", "patan"],
  Haryana: ["faridabad", "gurugram", "panipat", "ambala", "yamunanagar", "rohtak", "hisar", "karnal", "sonipat", "panchkula", "bhiwani", "sirsa", "bahadurgarh", "jind", "thanesar", "kaithal", "rewari", "palwal"],
  "Himachal Pradesh": ["shimla", "dharamshala", "mandi", "solan", "kangra", "kullu", "chamba", "una", "hamirpur", "palampur"],
  Jharkhand: ["ranchi", "jamshedpur", "dhanbad", "bokaro steel city", "phusro", "giridih", "deoghar", "hazaribagh", "ramgarh", "medininagar", "chas", "jhumri tilaiya", "godda", "sahibganj"],
  Karnataka: ["bengaluru", "mysuru", "hubballi", "mangaluru", "belagavi", "davangere", "ballari", "shivamogga", "tumakuru", "raichur", "kalaburagi (gulbarga)", "bidar", "udupi", "vijayapura", "chitradurga", "hassan", "gadag", "robertsonpet", "hosapete"],
  Kerala: ["kochi", "thiruvananthapuram", "kozhikode", "thrissur", "kollam", "palakkad", "alappuzha", "malappuram", "kannur", "kottayam", "kasaragod", "idukki", "pathanamthitta", "wayanad"],
  "Madhya Pradesh": ["bhopal", "indore", "jabalpur", "gwalior", "ujjain", "sagar", "dewas", "satna", "ratlam", "rewa", "murwara (katni)", "singrauli", "burhanpur", "khandwa", "morena", "bhind", "guna", "shivpuri", "chhindwara", "damoh"],
  Maharashtra: ["mumbai", "pune", "nagpur", "nashik", "aurangabad", "solapur", "kolhapur", "thane", "amravati", "nanded", "sangli", "akola", "malegaon", "dhule", "latur", "ahmednagar", "chandrapur", "parbhani", "jalgaon", "bhusawal"],
  Manipur: ["imphal", "thoubal", "bishnupur", "churachandpur", "ukhrul", "kakching", "lilong", "mayang imphal", "nambol"],
  Meghalaya: ["shillong", "tura", "jowai", "nongstoin", "baghmara", "williamnagar", "resubelpara", "mairang", "mawkyrwat"],
  Mizoram: ["aizawl", "lunglei", "saiha", "champhai", "kolasib", "serchhip", "lawngtlai", "mamit", "thenzawl"],
  Nagaland: ["kohima", "dimapur", "mokokchung", "wokha", "tuensang", "zunheboto", "mon", "kiphire", "phek", "longleng"],
  Odisha: ["bhubaneswar", "cuttack", "rourkela", "berhampur", "sambalpur", "puri", "balasore", "bhadrak", "baripada", "jeypore", "baleshwar", "barbil", "dhenkanal", "paralakhemundi", "rayagada"],
  Punjab: ["ludhiana", "amritsar", "jalandhar", "patiala", "bathinda", "hoshiarpur", "mohali", "batala", "pathankot", "moga", "barnala", "malerkotla", "khanna", "phagwara", "muktsar", "ferozepur"],
  Rajasthan: ["jaipur", "jodhpur", "udaipur", "kota", "ajmer", "bikaner", "sikar", "pali", "alwar", "bharatpur", "bhilwara", "ganganagar", "hanumangarh", "beawar", "churu", "jhunjhunu", "tonk", "kishangarh"],
  Sikkim: ["gangtok", "namchi", "gyalshing", "mangan", "singtam", "rangpo", "nayabazar", "rhenock", "chungthang"],
  "Tamil Nadu": ["chennai", "coimbatore", "madurai", "tiruchirappalli", "salem", "tirunelveli", "tiruppur", "erode", "vellore", "thoothukudi", "dindigul", "thanjavur", "ranipet", "sivakasi", "karur", "nagercoil", "pollachi", "kumbakonam", "rajapalayam", "pudukkottai"],
  Telangana: ["hyderabad", "warangal", "nizamabad", "karimnagar", "ramagundam", "kothagudem", "khammam", "mahabubnagar", "adilabad", "suryapet", "miryalaguda", "nalgonda", "jagtial", "mancherial", "kamareddy", "peddapalli", "siddipet", "vikarabad", "jangaon", "bhongir", "gadwal", "wanaparthy", "sangareddy", "medak", "nagarkurnool", "nirmal", "palwancha", "bodhan", "armoor", "kodad", "bellampally", "kagaznagar", "koratla", "sathupalli"],
  Tripura: ["agartala", "udaipur", "dharmanagar", "kumarghat", "kailasahar", "belonia", "sonamura", "ambassa", "santirbazar"],
  "Uttar Pradesh": ["lucknow", "kanpur", "ghaziabad", "agra", "varanasi", "meerut", "prayagraj", "bareilly", "aligarh", "moradabad", "saharanpur", "gorakhpur", "faizabad", "firozabad", "jhansi", "muzaffarnagar", "mathura", "rampur", "shahjahanpur", "badaun", "noida", "greater noida", "hapur", "etawah", "ayodhya"],
  Uttarakhand: ["dehradun", "haridwar", "roorkee", "haldwani", "rudrapur", "kashipur", "rishikesh", "pithoragarh", "almora", "nainital", "kotdwar"],
  "West Bengal": ["kolkata", "howrah", "durgapur", "asansol", "siliguri", "haldia", "kharagpur", "malda", "berhampore", "jalpaiguri", "north barrackpur", "barrackpur", "serampore", "chandannagar", "bansberia", "raiganj", "baharampur", "krishnanagar"],
  "Andaman and Nicobar Islands": ["port blair", "garacharma", "bambooflat", "diglipur", "mayabunder"],
  Chandigarh: ["chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["daman", "silvassa", "diu"],
  Delhi: ["new delhi", "delhi (national capital region includes parts of noida, ghaziabad, gurugram, faridabad)"],
  Lakshadweep: ["kavaratti", "agatti", "minicoy", "andrott"],
  Puducherry: ["puducherry", "karaikal", "mahe", "yanam"],
  Ladakh: ["leh", "kargil"],
  "Jammu and Kashmir": ["srinagar", "jammu", "anantnag", "baramulla", "sopore", "kathua", "rajouri", "udhampur", "handwara", "pulwama"],
};

const PropertyDetailsStep = ({
  register,
  errors,
  watch,
  inputClass,
  errorClass,
}: PropertyDetailsStepProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/auth/me"); // Use axios.get
        if (response.status === 200) { // Check for successful status code
          const userData: User = response.data.user; // Access data directly from response.data
          setUser(userData);
        } else {
          console.error("Failed to fetch user data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  const selectedType = watch("type");
  const selectedState = watch("state");
  const bedroomOptions = Array.from({ length: 6 }, (_, i) => i + 1)
    .map(String)
    .concat("6+");
  const bathroomOptions = Array.from({ length: 6 }, (_, i) => i + 1)
    .map(String)
    .concat("6+");
  const facingOptions = [
    "Not Specified",
    "North",
    "South",
    "East",
    "West",
    "North-East",
    "North-West",
    "South-East",
    "South-West",
  ];

  const availableCities = selectedState
    ? citiesByState[selectedState] || []
    : [];

  const canSelectPremium = user ? user.premiumBadging > 0 : false;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="state"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            State/Union Territory <span className="text-red-500">*</span>
          </label>
          <select
            id="state"
            {...register("state", {
              required: "State/Union Territory is required",
            })}
            className={clsx(inputClass, errors.state && errorClass)}
          >
            <option value="">Select State/Union Territory</option>
            {indiaStatesAndUTs.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="city"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            City <span className="text-red-500">*</span>
          </label>
          <select
            id="city"
            {...register("city", { required: "City is required" })}
            className={clsx(inputClass, errors.city && errorClass)}
            disabled={!selectedState || availableCities.length === 0}
          >
            <option value="">Select City</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="address"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Property Address <span className="text-red-500">*</span>
          </label>
          <input
            id="address"
            {...register("address", {
              required: "Property address is required",
            })}
            placeholder="Property Address"
            className={clsx(inputClass, errors.address && errorClass)}
          />
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">
              {errors.address.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            {...register("title", { required: "Title is required" })}
            placeholder="e.g., Prime Land for Sale, Spacious 3BHK Apartment"
            className={clsx(inputClass, errors.title && errorClass)}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="type"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Property Type
          </label>
          <select id="type" {...register("type")} className={inputClass}>
            <option value="land">Open Land / Farm Land</option>
            <option value="building">House Property</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="saleType"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Sale/Rent
          </label>
          <select
            id="saleType"
            {...register("saleType")}
            className={inputClass}
          >
            <option value="sale">Sale</option>
            <option value="rent">Rent</option>
          </select>
        </div>

        {selectedType === "land" && (
          <div>
            <label
              htmlFor="landCategory"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Land Category
            </label>
            <select
              id="landCategory"
              {...register("landCategory", {
                required: "Land category is required",
              })}
              className={clsx(inputClass, errors.landCategory && errorClass)}
            >
              <option value="">Select Category</option>
              <option value="Agricultural">Agricultural</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
            </select>
            {errors.landCategory && (
              <p className="text-red-500 text-xs mt-1">
                {errors.landCategory.message}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="area"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Total Area <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              id="area"
              {...register("area", {
                required: "Area is required",
                valueAsNumber: true,
                min: { value: 0, message: "Area cannot be negative" },
                validate: (value) =>
                  Number(value) > 0 || "Area must be a positive number",
              })}
              placeholder="e.g., 1200"
              type="number"
              step="any"
              className={clsx(
                inputClass,
                errors.area && errorClass,
                "flex-grow"
              )}
            />
            <select
              {...register("areaUnit", { required: "Area unit is required" })}
              className={clsx(
                inputClass,
                errors.areaUnit && errorClass,
                "w-32"
              )}
            >
              <option value="sqft">sq.ft</option>
              <option value="sqyd">sq.yd</option>
              <option value="sqm">sq.m</option>
              <option value="acres">acres</option>
            </select>
          </div>
          {errors.area && (
            <p className="text-red-500 text-xs mt-1">{errors.area.message}</p>
          )}
          {errors.areaUnit && (
            <p className="text-red-500 text-xs mt-1">
              {errors.areaUnit.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Price <span className="text-red-500">*</span>
          </label>
          <input
            id="price"
            {...register("price", {
              required: "Price is required",
              valueAsNumber: true,
              min: { value: 0, message: "Price cannot be negative" },
              validate: (value) =>
                Number(value) > 0 || "Price must be a positive number",
            })}
            placeholder="e.g., 5000000"
            type="number"
            className={clsx(inputClass, errors.price && errorClass)}
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label
            htmlFor="discount"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Discount (%)
          </label>
          <input
            id="discount"
            {...register("discount", {
              valueAsNumber: true,
              min: { value: 0, message: "Discount cannot be negative" },
              max: { value: 100, message: "Discount cannot be more than 100%" },
            })}
            placeholder="e.g., 10"
            type="number"
            className={clsx(inputClass, errors.discount && errorClass)}
          />
          {errors.discount && (
            <p className="text-red-500 text-xs mt-1">
              {errors.discount.message}
            </p>
          )}
        </div>

        {selectedType === "building" && (
          <>
            <div>
              <label
                htmlFor="floors"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Number of Floors
              </label>
              <input
                id="floors"
                {...register("floors", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Floors cannot be negative" },
                })}
                placeholder="e.g., 2"
                type="number"
                className={clsx(inputClass, errors.floors && errorClass)}
              />
              {errors.floors && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.floors.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="parking"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Parking
              </label>
              <input
                id="parking"
                {...register("parking", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Parking spots cannot be negative",
                  },
                })}
                placeholder="e.g., 1"
                type="number"
                className={clsx(inputClass, errors.parking && errorClass)}
              />
              {errors.parking && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.parking.message}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {selectedType === "building" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="bedrooms"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Bedrooms
            </label>
            <select
              id="bedrooms"
              {...register("bedrooms")}
              className={inputClass}
            >
              <option value="">Select</option>
              {bedroomOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="bathrooms"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Bathrooms
            </label>
            <select
              id="bathrooms"
              {...register("bathrooms")}
              className={inputClass}
            >
              <option value="">Select</option>
              {bathroomOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="propertyAge"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Property Age
            </label>
            <select
              id="propertyAge"
              {...register("propertyAge")}
              className={inputClass}
            >
              <option value="">Select</option>
              <option value="New">New</option>
              <option value="<5 Years">&lt; 5 Years</option>
              <option value="5-10 Years">5-10 Years</option>
              <option value=">10 Years">&gt; 10 Years</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="furnishing"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Furnishing
            </label>
            <select
              id="furnishing"
              {...register("furnishing")}
              className={inputClass}
            >
              <option value="">Select</option>
              <option value="Unfurnished">Unfurnished</option>
              <option value="Semi-furnished">Semi-furnished</option>
              <option value="Fully-furnished">Fully-furnished</option>
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="facing"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Facing
          </label>
          <select id="facing" {...register("facing")} className={inputClass}>
            {facingOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedType === "building" && (
        <div>
          <label
            htmlFor="otherDetails"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Other Details
          </label>
          <textarea
            id="otherDetails"
            {...register("otherDetails")}
            placeholder="e.g., Amenities, nearby landmarks, or any other relevant information."
            rows={4}
            className={inputClass}
          ></textarea>
        </div>
      )}

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Add as a Premium?
        </label>
        {loadingUser ? (
          <p className="text-gray-500 text-sm">Loading user data...</p>
        ) : (
          <div className="flex items-center gap-4">
            <label
              className={clsx("flex items-center", {
                "cursor-not-allowed opacity-50": !canSelectPremium,
              })}
            >
              <input
                type="radio"
                {...register("isPremium")}
                value="yes"
                className="form-radio text-[#2180d3] focus:ring-[#2180d3]"
                disabled={!canSelectPremium}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                {...register("isPremium")}
                value="no"
                className="form-radio text-[#2180d3] focus:ring-[#2180d3]"
                disabled={canSelectPremium && watch("isPremium") === "yes" && user?.premiumBadging === 0}
              />
              <span className="ml-2">No</span>
            </label>
            {!canSelectPremium && (
              <p className="text-red-500 text-xs mt-1">
                You need premium badging to select this option.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetailsStep;