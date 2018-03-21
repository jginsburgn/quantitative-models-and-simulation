#include <iostream>
#include <set>
#include <stdexcept>

#define MIDDLE_SQUARE_SIZE 16

typedef unsigned long long giantint;

std::pair<std::string, std::string> intercalate_reverse(std::string arg) {
	std::pair<std::string, std::string> retval;
	for (int i = arg.size() - 1; i >= 0; --i) {
		retval.first = arg[i--] + retval.first;
		if (i >= 0) retval.second = arg[i] + retval.second;
	}
	return retval;
}

std::string intercalate(std::string left, std::string right) {
	std::string retval = "";
	int index_left = 0;
	int index_right = 0;
	while (true) {
		if (left.size() > index_left) {
			retval += left[index_left++];
		}
		if (right.size() > index_right) {
			retval += right[index_right++];
		}
		if (left.size() == index_left && right.size() == index_right) break;
	}
	return retval;
}

auto msm(giantint seed) {
	giantint* current_result = new giantint(seed);
	auto g = [current_result](bool stop = false)-> giantint {
		if (stop) {
			delete current_result;
			return 0;
		}
		std::string previous_result_string = std::to_string(*current_result);
		//std::pair<std::string, std::string> res = intercalate_reverse(previous_result_string);
		std::string left_string = previous_result_string.substr(0, previous_result_string.size()/2);
		//std::string left_string = res.first;
		//std::cout << "stoull " << left_string << std::endl;
		if (left_string == "") left_string = "0";
		giantint left = std::stoull(left_string);
		std::string right_string = previous_result_string.substr(previous_result_string.size()/2);
		//std::string right_string = res.second;
		//std::cout << "stoull " << right_string << std::endl;
		if (right_string == "") right_string = "0";
		giantint right = std::stoull(right_string);
		giantint square_left = left*left;
		giantint square_right = right*right;
		char left_buffer[MIDDLE_SQUARE_SIZE + 1];
		char right_buffer[MIDDLE_SQUARE_SIZE + 1];
		std::string format = "%0" + std::to_string(MIDDLE_SQUARE_SIZE) + "llu";
		sprintf(left_buffer, format.c_str(), square_left);
		sprintf(right_buffer, format.c_str(), square_right);
		std::string square_left_string = std::string(left_buffer);
		std::string trimmed_square_left = square_left_string.substr(MIDDLE_SQUARE_SIZE/4, MIDDLE_SQUARE_SIZE/2);
		std::string square_right_string = std::string(right_buffer);
		std::string trimmed_square_right = square_right_string.substr(MIDDLE_SQUARE_SIZE/4, MIDDLE_SQUARE_SIZE/2);
		std::string current_result_string = intercalate(trimmed_square_left, trimmed_square_right);
		//std::string current_result_string = trimmed_square_left + trimmed_square_right;
		//std::cout << "stoull " << current_result_string << std::endl;
		*current_result = std::stoull(current_result_string);
		return *current_result;
	};
	return g;
}

int main(const int argc, const char* argv[]) {
	try {
		giantint seed = 5186479483157648;
		auto g = msm(seed);
		std::set<giantint> seen;
		giantint current = g();
		while(seen.find(current) == seen.end()) {
			seen.insert(current);
			std::cout << current << std::endl;
			current = g();
		}
		g(true);
		std::cout << "Period for seed " << seed << ": " << seen.size() << "." << std::endl;
	}
	catch (std::invalid_argument e) {
		puts(e.what());
	}
	return 0;
}
