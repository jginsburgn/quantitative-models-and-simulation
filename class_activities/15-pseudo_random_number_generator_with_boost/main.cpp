#include <iostream>
#include <set>
#include <stdexcept>
#include </usr/local/include/boost/multiprecision/cpp_int.hpp>

#include <iomanip>


#define MIDDLE_SQUARE_SIZE 16
using boost::multiprecision::uint512_t;
typedef unsigned long long giantint;

auto msm(giantint seed) {
    giantint* current_result = new giantint(seed);
    auto g = [current_result](bool stop = false)-> giantint {
        if (stop) {
            delete current_result;
            return 0;
        }
       
        uint512_t tremendously_big = *current_result;
        tremendously_big *= tremendously_big;
        
        std::string str = boost::lexical_cast<std::string>(tremendously_big);
        //std::cout << "string bithces: " << str << std::endl;
        //std::cout << "substring bitches: " << str.substr((str.size()/2-8), 16) << std::endl;
        *current_result = std::stoull(str.substr((str.size()/2-8), MIDDLE_SQUARE_SIZE));
        //std::cout << "value to return " << *current_result << std::endl;
        
       
        return *current_result;
    };
    return g;
}

bool isValid(giantint g){
    std::string number_string = std::to_string(g);
    if(number_string.size() != 16)
        return 0;
    std::vector<int> vec;
    for(int i = 0; i < number_string.size(); i++){
        int number = number_string[i] - '0';
        if(i%2 == 0){
            number *= 2;
            if(number > 9){
                int units = number%10;
                int tenths = number/10;
                number = units + tenths;
            } 

        }
        vec.push_back(number);
    }
    int acum = 0;
    for (auto& n : vec)
    acum += n;
    return acum%10 == 0;
};

int main(const int argc, const char* argv[]) {
	uint512_t all, valid = 0;
	giantint seed = 5186479483157648;
    giantint prueba = 4941330105954188;
	try {
        auto g = msm(seed);
        std::set<giantint> seen;
        giantint current = g();
        while(seen.find(current) == seen.end()) {
            if(isValid(current)){
                seen.insert(current);
                std::cout << current << std::endl;
                valid++;
            }
            all++;
            current = g();
            if(current == 0)
            	break;
        }
        std::cout << "Period for seed " << seed << ": " << all << "." << std::endl;
        std::cout << "Number of valid cards in period for seed " << ": " << valid << "." << std::endl;
        std::cout << "Percentage of credit cards in period " << double(valid)/double(all) << std::endl;
        g(true);
    }
    catch (std::invalid_argument e) {
    	puts(e.what());
    }
    std::cout << "is valid? " << isValid(prueba) << std::endl;
    return 0;
}
