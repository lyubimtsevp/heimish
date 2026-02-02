<?php
if (function_exists("apache_get_modules")) {
    print_r(apache_get_modules());
} else {
    echo "apache_get_modules not available";
}
